import Debug from 'debug';
import {createTransport} from 'nodemailer';

const debug = Debug('chums:lib:mailer');

export interface Address {
    name: string;
    address: string;
}

export interface sendMailProps {
    to: (string|Address) | (string|Address)[],
    cc?: (string|Address) | (string|Address)[],
    bcc?: (string|Address) | (string|Address)[],
    replyTo?: string|Address,
    from?: string|Address,
    subject?: string,
    html: string,
    textContent?: string,
    attachments?: any,
}


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

export const sendGmail = async ({
                                    to = [],
                                    cc = [],
                                    bcc = [],
                                    replyTo,
                                    from,
                                    subject,
                                    html,
                                    textContent,
                                    attachments
                                }: sendMailProps) => {
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
        debug('sendGmail()', {to, from, subject, replyTo});

        // return mailOptions;
        return await transporter.sendMail(mailOptions);
    } catch (err:unknown) {
        if (err instanceof Error) {
            debug("sendGmail()", err.message);
            return Promise.reject(err);
        }
        debug("sendGmail()", err);
        return Promise.reject(err);
    }
}

export const sendEmail = sendGmail;
