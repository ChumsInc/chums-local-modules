"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.sendGmail = exports.getLogoImageAttachment = exports.getTs36 = exports.getTs = void 0;
const debug_1 = __importDefault(require("debug"));
const nodemailer_1 = require("nodemailer");
const debug = (0, debug_1.default)('chums:lib:mailer');
const getTs = () => {
    return Date.now();
};
exports.getTs = getTs;
const getTs36 = () => {
    return (0, exports.getTs)().toString(36);
};
exports.getTs36 = getTs36;
/**
 *
 * @param {string} ts
 * @return {{path: string, filename: string, cid: string}}
 */
const getLogoImageAttachment = (ts = (0, exports.getTs36)()) => {
    return {
        filename: 'chums-logo-badge-400px.png',
        path: `/var/www/intranet.chums.com/images/chums-logo-badge-400px.png`,
        cid: `logo-${ts}@chums.com`
    };
};
exports.getLogoImageAttachment = getLogoImageAttachment;
const sendGmail = async ({ to = [], cc = [], bcc = [], replyTo, from, subject, html, textContent, attachments }) => {
    try {
        to = !Array.isArray(to) ? [to] : to;
        cc = !Array.isArray(cc) ? [cc] : cc;
        bcc = !Array.isArray(bcc) ? [bcc] : bcc;
        if (!from) {
            from = `"Chums AutoMailer" <automated@chums.com>`;
        }
        if (replyTo && !(cc.includes(replyTo) || bcc.includes(replyTo))) {
            cc.push(replyTo);
        }
        const transporter = (0, nodemailer_1.createTransport)({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_APP_PASSWORD,
            }
        });
        let mailOptions = {
            from,
            to,
            cc,
            bcc,
            replyTo,
            subject,
            html,
            text: textContent,
            attachments
        };
        debug('sendGmail()', { to, from, subject, replyTo });
        // return mailOptions;
        return await transporter.sendMail(mailOptions);
    }
    catch (err) {
        if (err instanceof Error) {
            debug("sendGmail()", err.message);
            return Promise.reject(err);
        }
        debug("sendGmail()", err);
        return Promise.reject(err);
    }
};
exports.sendGmail = sendGmail;
exports.sendEmail = exports.sendGmail;
