import { MjmlColumn, MjmlSection, MjmlTable } from '@faire/mjml-react';

export const MailmanTable = (payload: Record<string, any>) => {
  const headings = Object.keys(payload.value[0]);

  return (
    <MjmlSection padding={0} key={payload.value.toString()}>
      <MjmlColumn>
        <MjmlTable className="styled-table" >
          <thead>
            <tr>
              {headings.map((h) => (
                <th className='th-table' key={h.toString()}>{toTitleCase(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payload.value.map((item) => {
              let imageIndex = Object.keys(item).indexOf('image');
              let mainValues = Object.values(item) as string[];
              let restValues = Object.values(item) as string[];
              restValues.splice(imageIndex, 1);
              return (
                <tr key={item.toString()}>
                  {restValues.map((v) => (
                    <td className='td-table' key={v.toString()}>{v}</td>
                  ))}
                  <td className='td-table'>
                    <img src={mainValues[imageIndex]} alt="Item" width={40} height={40} loading={'lazy'} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </MjmlTable>
      </MjmlColumn>
    </MjmlSection>
  );
};
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
