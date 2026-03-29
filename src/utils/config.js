const mode = process.env.REACT_APP_MODE;

let app_url, api_url;


if (mode === 'production') {

  app_url = 'https://myhaat24.com';
  api_url = 'https://api.myhaat24.com';
} else {

  app_url = 'http://localhost:3000';
  api_url = 'http://localhost:5000';
}

export {
  app_url,
  api_url,
}