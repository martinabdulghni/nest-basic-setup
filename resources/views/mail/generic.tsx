import { Mjml } from '@faire/mjml-react';
import { MailmanHead } from '../components/head';
import { MailmanBody } from '../components/body';
import { MailmanHeader } from '../components/header';
import { MailmanBodyBuilder } from '../components/bodyBuilder';
import { MailmanFooter } from '../components/footer';

export const GenericMail = (payload: Record<string, any>) => {
  return (
    <Mjml>
      <MailmanHead title={payload.meta?.title} preview={payload.meta?.preview} />

      <MailmanBody>
        <>
          <MailmanHeader key={'header'} config={payload._templateConfig} />
          <MailmanBodyBuilder key={'body'} config={payload._templateConfig} fields={payload.genericFields} />
          <MailmanFooter key={'footer001'} config={payload._templateConfig} />
        </>
      </MailmanBody>
    </Mjml>
  );
};
