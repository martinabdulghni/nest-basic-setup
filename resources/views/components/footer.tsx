import { MjmlColumn, MjmlDivider, MjmlImage, MjmlSection, MjmlSocial, MjmlSocialElement, MjmlSpacer, MjmlText, MjmlWrapper } from '@faire/mjml-react';
import React from 'react';

export const MailmanFooter = (payload: Record<string, any>) => {
  const appLogoSrc = payload.config.appLogoSrc;
  const appName = payload.config.appName;
  const socialMedia = payload.config.socialMedia;
  const contactEmail = payload.config.contactEmail;

  return (
    <>
      <MjmlWrapper className="footer">
        <MjmlSection padding={0}>
          <MjmlColumn padding={0}>
            <MjmlDivider borderWidth={1} borderColor="#d1deec" />
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection padding={0}>
          <MjmlColumn>
            {contactEmail && <MjmlText align="center">Contact Us: {contactEmail}</MjmlText>}

            <MjmlText align="center">
              © {new Date().getFullYear()} {appName}
            </MjmlText>
          </MjmlColumn>
          {/* <MjmlColumn>
            <MjmlSocial icon-size="28px" mode="horizontal" align="right" padding="20px">
              {socialMedia.map((a: { name: string; href: string }) => (
                <MjmlSocialElement key={a.name.toString()} name={a.name} href={a.href} backgroundColor="#DCDCDC" color="darkgrey" />
              ))}
            </MjmlSocial>
          </MjmlColumn> */}
        </MjmlSection>
      </MjmlWrapper>
      <MjmlSpacer height={50} />
    </>
  );
};
