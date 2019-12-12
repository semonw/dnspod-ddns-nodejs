/**
 * 
 * Copyright (c) 2019 semonwang@163.com
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
const Promise = require('bluebird');
var request = require('request-promise');

function DNSPodAPI() {

  /**
   * 查询域名列表
   */
  this.getDomainList = function (login_token) {
    var formData = {
      login_token: login_token,
      'format': 'json',
      'lang': 'en'
    };
    return request.post({
      url: 'https://dnsapi.cn/Domain.List', formData: formData
    }).then(body => {
      var bodyObj = JSON.parse(body);
      if (bodyObj) {
        if (Array.isArray(bodyObj.domains)) {
          console.log("domain is array.");
        }
        return bodyObj.domains;
      }
      else {
        throw 'parsing body failed.';
      }
    }).catch(error => {
      console.log(error);
      return error;
    });
  };

  /**
   * 查询解析记录列表
   */
  this.getRecordListById = function (login_token, domain_id) {
    var formData = {
      login_token: login_token,
      'format': 'json',
      lang: 'en',
      domain_id: domain_id,
      //sub_domain: 'www', 不做类型过滤，可以查询所有子域记录
      //record_type: 'A',
    };

    return request.post({ url: 'https://dnsapi.cn/Record.List', formData: formData }).then(body => {
      console.log(body);
    });
  };


  /**
   * 查询解析记录列表
   */
  this.getRecordListByName = function (login_token, domain) {
    var formData = {
      login_token: login_token,
      'format': 'json',
      lang: 'en',
      domain: domain,
      //sub_domain: 'www', 不做类型过滤，可以查询所有子域记录
      //record_type: 'A',
    };

    return request.post({ url: 'https://dnsapi.cn/Record.List', formData: formData }).then(body => {
      var bodyObj = JSON.parse(body);
      if (bodyObj) {
        return bodyObj.records;
      }
    }).catch(error => {
      console.log(error);
      throw error;
    });
  };



  /**
   * domain_id 或 domain, 分别对应域名ID和域名, 提交其中一个即可
      record_id 记录ID，必选
      sub_domain 主机记录, 如 www，可选，如果不传，默认为 @
      record_type 记录类型，通过API记录类型获得，大写英文，比如：A，必选
      record_line 记录线路，通过API记录线路获得，中文，比如：默认，必选
      record_line_id 线路的ID，通过API记录线路获得，英文字符串，比如：‘10=1’ 【record_line 和 record_line_id 二者传其一即可，系统优先取 record_line_id】
      value 记录值, 如 IP:200.200.200.200, CNAME: cname.dnspod.com., MX: mail.dnspod.com.，必选
      mx {1-20} MX优先级, 当记录类型是 MX 时有效，范围1-20, mx记录必选
      ttl {1-604800} TTL，范围1-604800，不同等级域名最小值不同，可选
      status [“enable”, “disable”]，记录状态，默认为”enable”，如果传入”disable”，解析不会生效，也不会验证负载均衡的限制，可选
      weight 权重信息，0到100的整数，可选。仅企业 VIP 域名可用，0 表示关闭，留空或者不传该参数，表示不设置权重信息
   * 
   * @param {*} login_token 
   * @param {*} domain 
   * @param {*} record_id 
   * @param {*} sub_domain 
   * @param {*} record_type 
   * @param {*} value 
   */
  this.modifyRecord = function (login_token, domain, record_id, sub_domain, record_type, value) {
    var formData = {
      login_token: login_token,
      format: 'json',
      lang: 'en',
      domain: domain,
      record_id: record_id,
      sub_domain: sub_domain,
      record_type: record_type,
      record_line: '默认',
      value: value,
      mx: '1',
      ttl: '600'
    };

    return request.post({ url: 'https://dnsapi.cn/Record.Modify', formData: formData }).then(body => {
      return body;
    }).catch(error => {
      console.log(error);
      throw error;
    })
  };


  this.createRecord = function (login_token, domain, sub_domain, record_type, value) {
    var formData = {
      login_token: login_token,
      format: 'json',
      lang: 'en',
      domain: domain,
      sub_domain: sub_domain,
      record_type: record_type,
      record_line: '默认',
      value: value,
      mx: '1',
      ttl: '600'
    };

    request.post({ url: 'https://dnsapi.cn/Record.Create', formData: formData }).then(res => {
      return res;
    }).catch(err => {
      console.log(err);
      throw err;
    })
  };

}

module.exports = new DNSPodAPI();
