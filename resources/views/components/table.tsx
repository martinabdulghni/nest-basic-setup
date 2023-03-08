import { MjmlColumn, MjmlSection, MjmlTable, MjmlText } from '@faire/mjml-react';
import { head } from 'lodash';
import React from 'react';

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export const MailmanTable = (payload: Record<string, any>) => {
  const headings = Object.keys(payload.value[0]);

  return (
    <MjmlSection padding={0}>
      <MjmlColumn>
        <MjmlTable className="styled-table">
          <thead>
            <tr>
              {headings.map((h) => (
                <th>{toTitleCase(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payload.value.map((obj) => {
              obj.image = `<img src="${obj.image}" alt="${obj.name}" />`;
              let values = Object.values(obj) as [];

              return (
                <tr>
                  {values.map((v) => (
                    <td>{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </MjmlTable>
      </MjmlColumn>
    </MjmlSection>
  );
};
