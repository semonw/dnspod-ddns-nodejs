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
var DNSPodApi = require('./DNSPodApi');
var Promise = require('bluebird');
var request = require('request-promise');
var fs = require('fs');

function getIp() {
    return request.get({
        url: 'http://whatismyip.akamai.com'
    });
}


function readConfigSync() {
    if (!fs.existsSync('./config.json')) {
        return null;
    }

    var data = fs.readFileSync('./config.json');
    var config = JSON.parse(data.toString());
    return config;
}

function readCMDParams() {
    var args = process.argv.slice();
    if (args.length <= 2) {
        console.log('Command: node index.js secretId:XXX secretKey:XXX domain:XXX sub_domain:XXX interval:10\r\n');
        process.exit(0);
    }

    if (args.length < 7) {
        console.log('parameter error! \r\n.');
        console.log('Command: node index.js secretId:XXX secretKey:XXX domain:XXX sub_domain:XXX interval:10\r\n');
        process.exit(0);
    }

    var secretId_param = args[2].split(':');
    var secretKey_param = args[3].split(':');
    var domain_param = args[4].split(':');
    var sub_domain_param = args[5].split(':');
    var interval_param = args[6].split(':');
    if (secretId_param.length == 2 && secretKey_param.length == 2 && domain_param.length == 2 && sub_domain_param.length == 2) {
        var secretId = secretId_param[1];
        var secretKey = secretKey_param[1];
        var domain = domain_param[1];
        var sub_domain = sub_domain_param[1];
        var interval = interval_param[1];
        return {
            secretId: secretId,
            secretKey: secretKey,
            domain: domain,
            sub_domain: sub_domain,
            interval: interval
        };
    }
    else {
        return null;
    }
}


/**
 * 通过命令行参数来配置程序
 */
function modifyRecord(config) {
    const login_token = config.secretId + ',' + config.secretKey;
    const domain = config.domain;
    const sub_domain = config.sub_domain;
    var all = Promise.all([getIp(), DNSPodApi.getRecordListByName(login_token, domain)]);
    return all.spread((value, records) => {
        console.log('WAN IP Address is===>' + value + '==\r\n');
        if (!Array.isArray(records)) {
            throw 'records is not array.';
        }
        var record = records.find(record => record.name == sub_domain);
        if (record) {
            if (record.value == value) {
                return Promise.resolve("Record value is the same, so skip it.\r\n");
            }
            else {
                console.log('Modifing Record' + record.name + ' with value ' + value + '\r\n');
                return DNSPodApi.modifyRecord(login_token, domain, record.id, sub_domain, 'A', value);
            }
        } else {
            return Promise.reject('Doesnot found matching record.\r\n');
        }
    });
}


function main_func() {
    var config = readCMDParams();
    if (!config) {
        config = readConfigSync();
    }

    var interval = config.interval;
    if (!config || !interval) {
        interval = 10;
    }
    console.log("Updating DNA A Record per " + interval + " minitues.\r\n")
    /**
     * 每间隔5min检查一次
     */
    setInterval(() => {
        modifyRecord(config).then(res => {
            console.log(res);
        }).error(err => {
            console.log(err);
        }).catch(err => {
            console.log(err);
        });
    }, interval * 60 * 1000);
}

main_func();
