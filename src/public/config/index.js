/**
 * 小程序配置文件
 */
let environment = 'test';
let config = {};
if (environment === 'test') {
  config.appId = 'wx878f29f4478f429d';
  config.apiUrl = 'https://api-test.xiniunet.com/router?';
  config.app_key = 'FEDA506D38D8E930626E850139E74E0C';
  config.secret = '9019951CC31D86A31D2E911D4BE51142';
  config.tenantNumber = '300029';
  config.tenantId = '852769418315444224';
  config.uploadFile = 'https://my-test.xiniunet.com/api/attachmentUpload.do';
  config.uploadFileone = 'https://my-test.xiniunet.com/api/fileUpload.do';
}
module.exports = config;
