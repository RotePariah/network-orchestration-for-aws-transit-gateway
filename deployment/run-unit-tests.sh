#!/bin/bash
# pre-requisite
# python=3.9 | pip3=21.3.1

[ "$DEBUG" == 'true' ] && set -x
set -e

template_dir="$PWD"
source_dir="$template_dir/../source"
lambda_dir="$template_dir/../source/lambda"

# function to print headers
function headline() {
  echo "------------------------------------------------------------------------------"
  echo "$1"
  echo "------------------------------------------------------------------------------"
}

headline "[Init] Clean old folders"
cd $lambda_dir
rm -fr .venv
find . -type f -name ".coverage" -delete
find . -type f -name "coverage.xml" -delete

headline "[Init] Initiating virtual environment"
python3 -m venv .venv --upgrade-deps
source .venv/bin/activate
pip3 install -r requirements.txt
pip3 install -r testing_requirements.txt
deactivate && source .venv/bin/activate

headline "[Test] Config coverage report & run unit test"
coverage run -m pytest && coverage xml && coverage report -m
# coverage report gets generated with absolute path for source directory (eg. /codebuild/output/src218306025/src/source/lambda)
# sonarqube is run on a different codebuild project and would fail to identify absolute paths for source directory,
# this substitution is used to convert absolute source directory path to the corresponding project relative path.
coverage_report_path="$lambda_dir/coverage.xml"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e "s,<source>.*</source>,<source>source/lambda</source>,g" $coverage_report_path
else
  sed -i -e "s,<source>.*</source>,<source>source/lambda</source>,g" $coverage_report_path
fi
echo "deactivate virtual environment"
deactivate

run_javascript_tests() {
  local component_path=$1

  echo "------------------------------------------------------------------------------"
  echo "[Test] Run javascript unit test with coverage for $component_path"
  echo "------------------------------------------------------------------------------"

  cd $component_path
  npm install
  npm run test # run with coverage, make sure to disable watch mode
}

# Test the WebUI project
run_javascript_tests $source_dir/ui || true

# Test the cognito-trigger project
run_javascript_tests $source_dir/cognito-trigger || true
