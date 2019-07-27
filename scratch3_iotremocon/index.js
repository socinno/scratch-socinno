const formatMessage = require('format-message');
const nets = require('nets');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i44Os44Kk44Ok44O8XzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCINCgkgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRUVFRUVFO30NCgkuc3Qxe2ZpbGw6IzI0MjQyNDt9DQoJLnN0MntmaWxsOiNGRkFBMDA7fQ0KCS5zdDN7ZmlsbDojMDBGRkZGO30NCgkuc3Q0e2ZpbGw6I0ZGRkZGRjt9DQoJLnN0NXtmaWxsOiNGRjAwMzM7fQ0KCS5zdDZ7ZmlsbDojMDA4OEZGO30NCgkuc3Q3e2ZpbGw6I0FGOUM0QTt9DQoJLnN0OHtmaWxsOiMzMzMzMzM7fQ0KCS5zdDl7ZmlsbDojMDBGRjAwO30NCjwvc3R5bGU+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzguOSwzMS40YzAsMC4zLTAuMywwLjYtMC42LDAuNkgyLjFjLTAuMywwLTAuNi0wLjMtMC42LTAuNlY5YzAtMC4zLDAuMy0wLjYsMC42LTAuNmgzNi4yDQoJCWMwLjMsMCwwLjYsMC4zLDAuNiwwLjZWMzEuNHoiLz4NCjwvZz4NCjxyZWN0IHg9IjE4LjgiIHk9IjEzLjEiIGNsYXNzPSJzdDEiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMS44Ii8+DQo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNi4zLDE4YzAtMC4xLTAuMS0wLjMtMC4zLTAuM0gzYy0wLjEsMC0wLjMsMC4xLTAuMywwLjNWMjNjMCwwLjEsMCwwLjMsMCwwLjRjMCwwLDAsMCwwLDAuMQ0KCWMwLDEuMiwwLjgsMi4xLDEuOCwyLjFzMS44LTAuOSwxLjgtMi4xYzAtMC4xLDAtMC4xLDAtMC4xYzAtMC4xLDAtMC4zLDAtMC40VjE4eiIvPg0KPGNpcmNsZSBjbGFzcz0ic3QzIiBjeD0iMTIuMiIgY3k9IjIxLjQiIHI9IjQiLz4NCjxnPg0KCTxjaXJjbGUgY2xhc3M9InN0NCIgY3g9IjEyLjIiIGN5PSIyMS40IiByPSIyIi8+DQo8L2c+DQo8cmVjdCB4PSIxLjUiIHk9IjI5LjMiIGNsYXNzPSJzdDUiIHdpZHRoPSIzNy40IiBoZWlnaHQ9IjIuMSIvPg0KPHJlY3QgeD0iMS41IiB5PSIyNi41IiBjbGFzcz0ic3Q2IiB3aWR0aD0iMzcuNCIgaGVpZ2h0PSIyLjEiLz4NCjxyZWN0IHg9IjMxLjciIHk9IjE3IiBjbGFzcz0ic3Q3IiB3aWR0aD0iNy4xIiBoZWlnaHQ9IjQuMSIvPg0KPHJlY3QgeD0iMzMuNiIgeT0iMTMuNSIgY2xhc3M9InN0MCIgd2lkdGg9IjMuMyIgaGVpZ2h0PSIzLjMiLz4NCjxyZWN0IHg9IjcuMiIgeT0iMjYuNCIgY2xhc3M9InN0MSIgd2lkdGg9IjUuMSIgaGVpZ2h0PSI1LjEiLz4NCjxyZWN0IHg9IjMzLjYiIHk9IjIxLjQiIGNsYXNzPSJzdDAiIHdpZHRoPSIzLjMiIGhlaWdodD0iMy4zIi8+DQo8Y2lyY2xlIGNsYXNzPSJzdDgiIGN4PSI1IiBjeT0iMTEuMSIgcj0iMC44Ii8+DQo8Y2lyY2xlIGNsYXNzPSJzdDgiIGN4PSI5LjkiIGN5PSIxMS4xIiByPSIwLjgiLz4NCjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE5LjkiIGN5PSIxMS4xIiByPSIwLjgiLz4NCjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjI0LjkiIGN5PSIxMS4xIiByPSIwLjgiLz4NCjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjI5LjkiIGN5PSIxMS4xIiByPSIwLjgiLz4NCjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjM0LjkiIGN5PSIxMS4xIiByPSIwLjgiLz4NCjxjaXJjbGUgY2xhc3M9InN0OSIgY3g9IjE2LjUiIGN5PSIxMS41IiByPSIxLjgiLz4NCjxyZWN0IHg9IjE4LjgiIHk9IjE1LjIiIGNsYXNzPSJzdDciIHdpZHRoPSI4LjIiIGhlaWdodD0iNy41Ii8+DQo8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSI5LjgiIGN5PSIyOSIgcj0iMS43Ii8+DQo8cGF0aCBjbGFzcz0ic3Q2IiBkPSJNMTMuNyw5LjFIMi40Yy0wLjIsMC0wLjMsMC4xLTAuMywwLjN2Ni44YzAsMC4yLDAuMSwwLjMsMC4zLDAuM2gxLjZ2LTJoMS41djJoMS44di0yaDEuNXYyaDEuOHYtMmgxLjV2MmgxLjYNCgljMC4yLDAsMC4zLTAuMSwwLjMtMC4zVjkuNEMxNCw5LjIsMTMuOCw5LjEsMTMuNyw5LjF6Ii8+DQo8L3N2Zz4NCg==';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = menuIconURI;

/**
 * How long to wait in ms before timing out requests to IoT Terminal.
 * @type {int}
 */
const serverTimeoutMs = 5000; // 5 seconds (chosen arbitrarily).
const serverTimeoutMsLong = 18000; // 18 seconds (chosen arbitrarily).

const LED_ARR = ['ON', 'OFF'];
const IR_NO_ARR = ['1', '2', '3', '4', '5']; // String型（IR_NOの選択肢）
const IFTTT_ARR = ['MAIL', 'CLOUD'];

/**
 * Class for the iotremocon blocks.
 * @constructor
 */
class Scratch3IotRemoconBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        /**
         * The most recently received value for each sensor.
         */
        this._sensors = {
            temperature: -99,
            humidity: -99,
            illuminance: -99
        };
        this._iotRemoconIp = '192.168.x.x';
        this._iotRemoconStatus = '-';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'iotremocon',
            name: 'IoT Smart Remocon',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'setIotIp',
                    text: formatMessage({
                        id: 'iotremocon.setIotIpBlock',
                        default: 'IoT Remocon IP [IPADDR]',
                        description: 'set IoT Remocon IP.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        IPADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: this._iotRemoconIp
                        }
                    }
                },
                '---',
                {
                    opcode: 'ledControl',
                    text: formatMessage({
                        id: 'iotremocon.ledControl',
                        default: 'LED Control [LED_CONT]',
                        description: 'LED Control'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LED_CONT: {
                            type: ArgumentType.STRING,
                            menu: 'led_cont',
                            defaultValue: 'ON'
                        }
                    }
                },
                {
                    opcode: 'updateSensorData',
                    text: formatMessage({
                        id: 'iotremocon.updateSensorData',
                        default: 'Update Sensor',
                        description: 'Update Sensor Data'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'irRecvControl',
                    text: formatMessage({
                        id: 'iotremocon.irRecvControl',
                        default: 'Record Remote Control [IR_NO]',
                        description: 'Record Remote Control Signal'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        IR_NO: {
                            type: ArgumentType.STRING,
                            menu: 'ir_nos',
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'irSendControl',
                    text: formatMessage({
                        id: 'iotremocon.irSendControl',
                        default: 'Send Remote Control [IR_NO]',
                        description: 'Send Remote Control Signal'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        IR_NO: {
                            type: ArgumentType.STRING,
                            menu: 'ir_nos',
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'iftttWebhooksControl',
                    text: formatMessage({
                        id: 'iotremocon.iftttWebhooksControl',
                        default: 'IFTTT WebHooks [IFTTT_JOB]',
                        description: 'Triger IFTTT WebHooks'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        IFTTT_JOB: {
                            type: ArgumentType.STRING,
                            menu: 'ifttt_job',
                            defaultValue: 'MAIL'
                        }
                    }
                },
                '---',
                {
                    opcode: 'getViewerRemoconIp',
                    text: formatMessage({
                        id: 'iotremocon.viewerRemoconIp',
                        default: 'IoT Remocon IP',
                        description: 'IoT Remocon IP of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'getViewerRemoconStatus',
                    text: formatMessage({
                        id: 'iotremocon.viewerRemoconStatus',
                        default: 'IoT Remocon Status',
                        description: 'IoT Remocon Status of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'getViewerTemperature',
                    text: formatMessage({
                        id: 'iotremocon.viewerTemperature',
                        default: 'Temperature',
                        description: 'Temperature of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'getViewerHumidity',
                    text: formatMessage({
                        id: 'iotremocon.viewerHumidity',
                        default: 'Humidity',
                        description: 'Humidity of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'getViewerIlluminance',
                    text: formatMessage({
                        id: 'iotremocon.viewerIlluminance',
                        default: 'Illuminance',
                        description: 'Illuminance of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                }
            ],
            menus: {
                led_cont: {
                    acceptReporters: true,
                    items: LED_ARR
                },
                ir_nos: {
                    acceptReporters: true,
                    items: IR_NO_ARR
                },
                ifttt_job: {
                    acceptReporters: true,
                    items: IFTTT_ARR
                }
            }
        };
    }
    
    setIotIp (args) {
        this._iotRemoconIp = Cast.toString(args.IPADDR);
        log.log(this._iotRemoconIp);
    }

    getViewerRemoconIp () {
        return this._iotRemoconIp;
    }

    getViewerRemoconStatus () {
        return this._iotRemoconStatus;
    }

    getViewerTemperature () {
        return this._sensors.temperature;
    }

    getViewerHumidity () {
        return this._sensors.humidity;
    }

    getViewerIlluminance () {
        return this._sensors.illuminance;
    }

    ledControl (args) {
        const urlBase = `http://${this._iotRemoconIp}/led?o=${args.LED_CONT}`;
        log.log(`IrSend:${urlBase}`);
        this._iotRemoconStatus = 'LED Controling...';
        this.controlIot(urlBase, serverTimeoutMs);
    }

    irRecvControl (args) {
        const urlBase = `http://${this._iotRemoconIp}/recv?n=${args.IR_NO}`;
        log.log(`IrRecv:${urlBase}`);
        this._iotRemoconStatus = 'Receiving...';
        this.controlIot(urlBase, serverTimeoutMsLong);
    }

    irSendControl (args) {
        const urlBase = `http://${this._iotRemoconIp}/send?n=${args.IR_NO}`;
        log.log(`IrSend:${urlBase}`);
        this._iotRemoconStatus = 'Sending...';
        this.controlIot(urlBase, serverTimeoutMs);
    }

    iftttWebhooksControl (args) {
        const urlBase = `http://${this._iotRemoconIp}/ifttt?j=${args.IFTTT_JOB}`;
        log.log(`IFTTT Access:${urlBase}`);
        this._iotRemoconStatus = 'IFTTT trigering...';
        this.controlIot(urlBase, serverTimeoutMsLong);
    }

    controlIot (urlBase, serverTimeoutMsSet) {
        const updatePromise = new Promise(resolve => {
            nets({
                url: urlBase,
                timeout: serverTimeoutMsSet
            }, (err, res, body) => {
                if (err) {
                    this._iotRemoconStatus = 'Failed';
                    log.log(`error sensor update! ${err}/${res}`);
                    this.resetSensor();
                    resolve('');
                    return '';
                }
                if (body.indexOf('OK') === -1) {
                    this._iotRemoconStatus = 'Failed';
                } else {
                    this._iotRemoconStatus = 'Completed';
                }
                resolve(body);
                return body;
            });
        });
        updatePromise.then(result => result);
        return updatePromise;
    }

    updateSensorData () {
        if (this._iotRemoconIp.indexOf('x') !== -1) {
            this.resetSensor();
            return '';
        }
        const urlBase = `http://${this._iotRemoconIp}/update`;
        log.log(`Update:${urlBase}`);
        this._iotRemoconStatus = 'Sensor Updating...';
        const updatePromise = new Promise(resolve => {
            nets({
                url: urlBase,
                timeout: serverTimeoutMs
            }, (err, res, body) => {
                if (err) {
                    this._iotRemoconStatus = 'Update Failed';
                    log.log(`error sensor update! ${err}/${res}`);
                    this.resetSensor();
                    resolve('');
                    return '';
                }
                const getSensor = JSON.parse(body);
                const getTemp = Cast.toNumber(getSensor.t);
                // log.log(`Update.temperature:${getSensor.t}`);
                if (getTemp > -50) {
                    this._iotRemoconStatus = 'Completed';
                    this._sensors.temperature = getTemp;
                    this._sensors.humidity = Cast.toNumber(getSensor.h);
                    this._sensors.illuminance = Cast.toNumber(getSensor.l);
                } else {
                    this._iotRemoconStatus = 'Update Failed';
                    this.resetSensor();
                }
                resolve(body);
                return body;
            });
        });
        updatePromise.then(result => result);
        return updatePromise;
    }

    resetSensor () {
        this._sensors = {
            temperature: -99,
            humidity: -99,
            illuminance: -99
        };
        return;
    }

}
module.exports = Scratch3IotRemoconBlocks;
