#!/usr/bin/env bash
set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required. Install jq and retry." >&2
  exit 1
fi

OUT_DIR="${1:-website/images/blog/external}"
mkdir -p "$OUT_DIR"

MANIFEST_JSON="$OUT_DIR/attribution.json"
MANIFEST_MD="$OUT_DIR/ATTRIBUTION.md"
TMP_JSON="$(mktemp)"

# id|Wikimedia file title (without File: prefix)
entries=(
  "sm_beach_sunset|Sunshine_at_Santa_Marta_beach_Colombia.jpeg"
  "sm_rodadero_aerial|El_Rodadero,_Santa_Marta-Colombia_pan.jpg"
  "sm_rodadero_shore|El_Rodadero-Santa_Marta.jpg"
  "sm_sierra_nevada_view|SIERRA_NEVADA_DE_SANTA_MARTA.jpg"
  "sm_sierra_dawn|Amanecer_Sierra_Nevada_de_Santa_Marta.jpg"
  "sm_sierra_forest|Sierra_nevada_de_santa_Marta.jpg"
)

printf '[]' > "$TMP_JSON"

echo "Downloading Wikimedia images to: $OUT_DIR"

for entry in "${entries[@]}"; do
  IFS='|' read -r id file_title <<< "$entry"

  api_url="https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&titles=File:${file_title}&iiprop=url|extmetadata"

  response="$(curl -fsSL "$api_url")"
  image_url="$(echo "$response" | jq -r '.query.pages[] | .imageinfo[0].url // empty')"

  if [[ -z "$image_url" ]]; then
    echo "Skipped $id (no image URL found for File:${file_title})" >&2
    continue
  fi

  ext="${image_url##*.}"
  ext="${ext%%\?*}"
  ext="${ext,,}"
  [[ "$ext" =~ ^(jpg|jpeg|png|webp)$ ]] || ext="jpg"

  out_file="$OUT_DIR/${id}.${ext}"
  curl -fsSL "$image_url" -o "$out_file"

  artist="$(echo "$response" | jq -r '.query.pages[] | .imageinfo[0].extmetadata.Artist.value // "Unknown"')"
  license="$(echo "$response" | jq -r '.query.pages[] | .imageinfo[0].extmetadata.LicenseShortName.value // "Unknown"')"
  license_url="$(echo "$response" | jq -r '.query.pages[] | .imageinfo[0].extmetadata.LicenseUrl.value // ""')"
  description_url="https://commons.wikimedia.org/wiki/File:${file_title}"

  jq --arg id "$id" \
     --arg file "$(basename "$out_file")" \
     --arg source "$description_url" \
     --arg image_url "$image_url" \
     --arg artist "$artist" \
     --arg license "$license" \
     --arg license_url "$license_url" \
     '. += [{id:$id,file:$file,source:$source,image_url:$image_url,artist:$artist,license:$license,license_url:$license_url}]' \
     "$TMP_JSON" > "${TMP_JSON}.next"
  mv "${TMP_JSON}.next" "$TMP_JSON"

  echo "Saved: $out_file"
done

mv "$TMP_JSON" "$MANIFEST_JSON"

{
  echo "# Wikimedia Image Attribution"
  echo
  echo "Generated on: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo
  echo "| ID | File | Author | License | Source |"
  echo "|---|---|---|---|---|"
  jq -r '.[] | "| \(.id) | \(.file) | \(.artist | gsub("<[^>]*>"; "") | gsub("\n"; " ")) | \(.license) | [link](\(.source)) |"' "$MANIFEST_JSON"
} > "$MANIFEST_MD"

echo "Wrote manifest: $MANIFEST_JSON"
echo "Wrote attribution table: $MANIFEST_MD"
