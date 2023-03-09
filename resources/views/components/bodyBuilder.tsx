import { MailmanButton } from './button';
import { MailmanDivider } from './divider';
import { Greeting } from './greeting';
import { TextLine } from './text';
import { MjmlColumn, MjmlSection } from '@faire/mjml-react';
import { MailmanTable } from './table';

export const MailmanBodyBuilder = (payload: Record<string, any>) => {
  return (
    <MjmlSection backgroundColor="#ffffff">
      <MjmlSection padding={0}>
        <MjmlColumn>
          {payload.fields.map((obj: { greeting: any; line: any; divider: any; action: any; table: any }) => {
            if (obj.greeting) {
              return <Greeting value={obj.greeting.toString()} key={obj.greeting} />;
            }

            if (obj.line) {
              return <TextLine value={obj.line} key={obj.line.toString()} />;
            }

            if (obj.divider) {
              return <MailmanDivider key={obj.divider.toString()} />;
            }

            if (obj.action) {
              return <MailmanButton value={obj.action} key={obj.action.toString()} />;
            }

            if (obj.table) {
              return <MailmanTable value={obj.table} key={obj.table.toString()} />;
            }
          })}
        </MjmlColumn>
      </MjmlSection>
    </MjmlSection>
  );
};
