let fileContent = `

language: node_js
sudo: enabled
node_js:
  - "8"
script:
  - npm run test
  - npm run build
after_script:
  - npm run test-nyc

cache:
  directories:
  - node_modules

deploy:
  - provider: npm
    skip_cleanup: true
    email: heifade@126.com
    api_key: $NPM_TOKEN
    on:
      branch: master
      repo: heifade/{{projectName}}
  - provider: pages
    skip_cleanup: true
    github_token: $GITHUB_TOKEN
    local_dir: docs
    on:
      branch: master







`;


fileContent = fileContent.replace(/(script\s*:)((.|\n)*?)(\s*-\s*npm\s*run\s*test)/, (w, a, b, c, d) => {
  return w.replace(d, "");
});
fileContent = fileContent.replace(/(after_script\s*:)((.|\n)*?)(\s*-\s*npm\s*run\s*test-nyc)/, (w, a, b, c, d) => {
  return w.replace(a, "").replace(d, "");
})
fileContent = fileContent.replace(/(-\s*provider:\s*pages\s*)([^-]*)/, '');

console.log(fileContent);