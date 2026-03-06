# Image Workflow

## 1) Download real images from Wikimedia (no API key)

```bash
scripts/fetch_wikimedia_blog_images.sh
```

Outputs:
- `website/images/blog/external/*` image files
- `website/images/blog/external/attribution.json`
- `website/images/blog/external/ATTRIBUTION.md`
- `website/images/blog/external/post-image-map.json`

## 2) Generate images with OpenAI (when token is available)

```bash
export OPENAI_API_KEY="YOUR_KEY"
node scripts/generate_blog_images_openai.mjs
```

Outputs:
- `website/images/blog/generated/*.png`
- `website/images/blog/generated/prompts.json`

## Notes

- Wikimedia files include attribution metadata, keep `ATTRIBUTION.md` in the repo.
- Generated OpenAI images are prompt-tracked in `prompts.json`.
