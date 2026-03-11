function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: location },
      'cache-control': { value: 'public, max-age=3600' }
    }
  };
}

var ROUTES = {
  "/": "/index.html",
  "/category/activities": "/category/activities.html",
  "/category/dinning": "/category/dinning.html",
  "/category/travel": "/category/travel.html",
  "/contact-us": "/contact-us.html",
  "/data-polices": "/data-polices.html",
  "/es/category/activities": "/es/category/activities.html",
  "/es/category/dinning": "/es/category/dinning.html",
  "/es/category/travel": "/es/category/travel.html",
  "/es/contactanos": "/es/contactanos.html",
  "/es/guia-turistica": "/es/guia-turistica.html",
  "/es/habeas-data": "/es/habeas-data.html",
  "/es/inicio": "/es/inicio.html",
  "/es/preguntas-fecuentes": "/es/preguntas-fecuentes.html",
  "/es/reglas-y-politicas": "/es/reglas-y-politicas.html",
  "/faq": "/faq.html",
  "/post-espanol/donde-alojarse-en-santa-marta-bello-horizonte-vs-rodadero-vs-centro-historico": "/post-espanol/donde-alojarse-en-santa-marta-bello-horizonte-vs-rodadero-vs-centro-historico.html",
  "/post-espanol/explorando-la-sierra-nevada-de-santa-marta-aventuras-de-trekking-y-encuentros-con-comunidades-indigenas": "/post-espanol/explorando-la-sierra-nevada-de-santa-marta-aventuras-de-trekking-y-encuentros-con-comunidades-indigenas.html",
  "/post-espanol/guia-combinada-minca-santa-marta-cascadas-cafe-logistica": "/post-espanol/guia-combinada-minca-santa-marta-cascadas-cafe-logistica.html",
  "/post-espanol/guia-viaje-santa-marta-playas-historia-aventura": "/post-espanol/guia-viaje-santa-marta-playas-historia-aventura.html",
  "/post-espanol/santa-marta-sin-tayrona-itinerario-practico-5-dias": "/post-espanol/santa-marta-sin-tayrona-itinerario-practico-5-dias.html",
  "/post/aventuras-caminatas-sierra-nevada-santa-marta": "/post/aventuras-caminatas-sierra-nevada-santa-marta.html",
  "/post/minca-santa-marta-combo-guide": "/post/minca-santa-marta-combo-guide.html",
  "/post/santa-marta-first-time-guide": "/post/santa-marta-first-time-guide.html",
  "/post/santa-marta-without-tayrona-5-day-itinerary": "/post/santa-marta-without-tayrona-5-day-itinerary.html",
  "/post/where-to-stay-santa-marta-bello-horizonte-vs-rodadero-vs-historic-center": "/post/where-to-stay-santa-marta-bello-horizonte-vs-rodadero-vs-historic-center.html",
  "/rules-and-policies": "/rules-and-policies.html",
  "/santa-marta-and-sierra-nevada-tourist-guide": "/santa-marta-and-sierra-nevada-tourist-guide.html",
  "/es/manual-de-huespedes": "/es/manual-de-huespedes.html",
  "/en/guest-manual": "/en/guest-manual.html"
};

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers && request.headers.host && request.headers.host.value
    ? request.headers.host.value.toLowerCase()
    : '';
  var isGuestHost = host === 'huespedes.sierraseasuite.com';

  if (isGuestHost && (uri === '/' || uri === '/index.html')) {
    request.uri = '/es/manual-de-huespedes.html';
    return request;
  }

  if (uri !== '/' && uri.endsWith('/')) {
    var noSlash = uri.slice(0, -1);
    if (ROUTES[noSlash]) {
      return redirect(noSlash);
    }
  }

  if (uri === '/index.html') {
    return redirect('/');
  }

  if (uri.endsWith('.html')) {
    var clean = uri.slice(0, -5);
    if (clean === '') clean = '/';
    if (ROUTES[clean]) {
      return redirect(clean);
    }
  }

  if (uri === '/es') {
    return redirect('/es/inicio');
  }

  if (uri === '/') {
    request.uri = '/index.html';
    return request;
  }

  if (ROUTES[uri]) {
    request.uri = ROUTES[uri];
    return request;
  }

  return request;
}
