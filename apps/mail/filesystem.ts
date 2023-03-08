import { registerAs } from '@nestjs/config';
import { MailmanOptions } from '@squareboat/nest-mailman';
import { GenericMail } from 'resources/views/mail';

export const mailSchema = {
  host: process.env.MAIL_HOST,
  port: +process.env.MAIL_PORT,
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_SENDER_ID,
  templateConfig: {
    baseComponent: GenericMail,
    templateOptions: {
      socialMedia: [
        {
          name: 'instagram-noshare',
          href: 'https://www.instagram.com/loryoffical/',
        },
        {
          name: 'linkedin-noshare',
          href: 'https://www.linkedin.com/company/loryio',
        },
        {
          name: 'github-noshare',
          href: 'https://github.com/loryio',
        },
      ],
      appLogoSrc: 'https://i.ibb.co/gtmMP7m/loryinc-small.png',
      appName: 'Lory Inc.',
      contactEmail: 'contact@lory.io',
    },
  },
};
export default registerAs('mailman', () => mailSchema as MailmanOptions);
