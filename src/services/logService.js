//import Raven from 'raven-js'
function init(){
    // Raven.config('https://f9c6d1a3dd8e4619a8557a21a052f06c@o769752.ingest.sentry.io/5798675', {
    //     release:'1-0-0',
    //     environment:'development-test'
    // }).install();
}
function log(error){
    // Raven.captureException(error);
    console.error(error)
}

export default {
    init,
    log
};