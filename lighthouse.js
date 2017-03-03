const Lighthouse = require('lighthouse');
const ChromeLauncher = require('lighthouse/lighthouse-cli/chrome-launcher.js').ChromeLauncher;
const Printer = require('lighthouse/lighthouse-cli/printer');

function launchChromeAndRunLighthouse(url, flags, config) {
  const launcher = new ChromeLauncher({port: 9222, autoSelectChrome: true});

  return launcher.isDebuggerReady()
    .catch(() => {
      if (flags.skipAutolaunch) {
        return;
      }
      return launcher.run(); // Launch Chrome.
    })
    .then(() => Lighthouse(url, flags, config)) // Run Lighthouse.
    .then(results => launcher.kill().then(() => results)) // Kill Chrome and return results.
    .catch(err => {
      // Kill Chrome if there's an error.
      return launcher.kill().then(() => {
        throw err;
      }, console.error);
    });
}

// Use an existing config or create a custom one.
const config = require('lighthouse/lighthouse-core/config/perf.json');
const url = 'https://seek.com.au/career-guide/355-project-manager-information-n-communication-technology/';
const flags = {'output-path': './dist/index.html', output: 'html'};

function getOverallScore(lighthouseResults) {
  const scoredAggregations = lighthouseResults.aggregations.filter(a => a.scored);
  const total = scoredAggregations.reduce((sum, aggregation) => sum + aggregation.total, 0);
  return (total / scoredAggregations.length) * 100;
}

launchChromeAndRunLighthouse(url, flags, config).then(lighthouseResults => {
  lighthouseResults.artifacts = undefined; // You can save the artifacts separately if so desired
  console.log('This needs to go to DataDog', getOverallScore(lighthouseResults))
  return Printer.write(lighthouseResults, flags.output, flags['output-path']);
}).catch(err => console.error(err));
