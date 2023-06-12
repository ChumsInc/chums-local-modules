import Debug from 'debug';
import { createTransport } from 'nodemailer';
const debug = Debug('chums:lib:mailer');
export const getTs = () => {
    return Date.now();
};
export const getTs36 = () => {
    return getTs().toString(36);
};
/**
 *
 * @param {string} ts
 * @return {{path: string, filename: string, cid: string}}
 */
export const getLogoImageAttachment = (ts = getTs36()) => {
    return {
        filename: 'chums-logo-badge-400px.png',
        path: `/var/www/intranet.chums.com/images/chums-logo-badge-400px.png`,
        cid: `logo-${ts}@chums.com`
    };
};
export const sendGmail = async ({ to = [], cc = [], bcc = [], replyTo, from, subject, html, textContent, attachments }) => {
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
        const transporter = createTransport({
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
export const sendEmail = sendGmail;
