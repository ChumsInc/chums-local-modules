"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.sendGmail = exports.getLogoImageAttachment = exports.getTs36 = exports.getTs = exports.sendOldSESEmail = void 0;
const debug_1 = require("debug");
const nodemailer_1 = require("nodemailer");
const debug = (0, debug_1.default)('chums:lib:mailer');
/**
 * The following environment variables are required:
 *     <div>
 *         <strong>AMAZON_SES_HOST</strong>
 *         <strong>AMAZON_SES_PORT</strong>
 *         <strong>AMAZON_SES_USERNAME</strong>
 *         <strong>AMAZON_SES_PASSWORD</strong>
 *     </div>
 * @param {string|string[]} [to]
 * @param {string|string[]} [cc]
 * @param {string|string[]} [bcc]
 * @param {string} replyTo
 * @param {string} from
 * @param {string} subject
 * @param {string} html
 * @param {string} [textContent]
 * @param [attachments]
 */
const sendOldSESEmail = async ({ to = [], cc = [], bcc = [], replyTo, from, subject, html, textContent, attachments }) => {
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
        process.env.AWS_ACCESS_KEY_ID = process.env.AMAZON_SES_USERNAME;
        process.env.AWS_SECRET_ACCESS_KEY = process.env.AMAZON_SES_PASSWORD;
        const transporter = (0, nodemailer_1.createTransport)({
            host: process.env.AMAZON_SES_HOST,
            port: Number(process.env.AMAZON_SES_PORT),
            secure: true,
            auth: {
                user: process.env.AMAZON_SES_USERNAME,
                pass: process.env.AMAZON_SES_PASSWORD
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
        // return mailOptions;
        return await transporter.sendMail(mailOptions);
    }
    catch (err) {
        if (err instanceof Error) {
            debug("sendEmail()", err.message);
            return Promise.reject(err);
        }
        debug("sendEmail()", err);
        return Promise.reject(err);
    }
};
exports.sendOldSESEmail = sendOldSESEmail;
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
