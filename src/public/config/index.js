/**
 * 小程序配置文件
 */
let environment = 'test';
let config = {};
if (environment === 'test') {
  config.appId = 'xx';
  config.apiUrl = 'https://api-test.xiniunet.com/router?';
  config.app_key = 'xx';
  config.secret = 'xx';
  config.tenantNumber = 'x';
  config.tenantId = 'x';
  config.uploadFile = 'x';
  config.uploadFileone = 'x';
}
module.exports = config;
