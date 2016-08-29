require.config({
    baseUrl: site.baseurl + '/js/',
    // Todo SIP (Subresource Integrity Protection)
    paths: {
        'babel-polyfill': 'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.13.0/polyfill.min',
        'jquery': 'https://code.jquery.com/jquery-2.2.4.min',
        'bootstrap': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min',
        'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
        'image': 'https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/image.min'
    }
});
// Require babel-polyfill before anything else.
require(['babel-polyfill'], function onPolyfillLoaded() {
    require(['jquery'], function onJQLoaded($) {
        $(() => require(['bootstrap-main']));
    });
});