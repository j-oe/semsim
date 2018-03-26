# semsim - Semantically Weighted Similarity Analysis for XML-based Content Components
Implementation of the methods presented in the paper.

Related work can be found at the author's website: http://janoevermann.de

## Dependencies
This demo is based on the project *fastclass* by the same author, which offers additional classification features (http//fastclass.de).

## Example data
The example data used in the paper can be found at `src/res/examples/`

## Run locally
To run a local version start a web server in the `dist` folder and navigate your browser to the location.

## Build from source
To build from source you need to have the following tools globally installed:
- *npm* (for development dependencies)
- *Bower* (for frontend dependencies)
- *Gulp* (for running the build)

Execute the following steps to set up the development environment (directory `src`)
1. `npm install`
2. `bower install`
3. `gulp`

To generate a build for use in production (directory `dist`):
1. `gulp build`