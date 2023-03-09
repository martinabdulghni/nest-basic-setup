import { MjmlBody } from '@faire/mjml-react';

export const MailmanBody = ({ children }: { children: JSX.Element }) => {
  return <MjmlBody className="default-bg">{children}</MjmlBody>;
};
