import React, { useEffect, useState } from 'react';

const TicketList = () => {
  const [data, setData] = useState(null);
  const [displayMode, setDisplayMode] = useState('user');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers');
        const apiData = await response.json();
        setData(apiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const groupData = () => {
    if (!data) return {};

    const groupedData = {};

    data.tickets.forEach((ticket) => {
      const key = displayMode === 'user' ? ticket.userId : ticket.status;
      const subKey = displayMode === 'user' ? ticket.status : ticket.priority;

      if (!groupedData[key]) {
        groupedData[key] = {};
      }

      if (!groupedData[key][subKey]) {
        groupedData[key][subKey] = [];
      }

      groupedData[key][subKey].push(ticket);
    });

    return groupedData;
  };

  const renderTable = () => {
    const groupedData = groupData();

    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>{displayMode === 'user' ? 'User' : 'Status'}</th>
            <th>{displayMode === 'user' ? 'Status' : 'Priority'}</th>
            <th>{displayMode === 'user' ? 'Tickets' : 'Tickets Count'}</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((key) => (
            Object.keys(groupedData[key]).map((subKey) => (
              <tr key={`${key}-${subKey}`}>
                <td>{key}</td>
                <td>{subKey}</td>
                <td>
                  {displayMode === 'user' ? (
                    groupedData[key][subKey].map((ticket) => (
                      <div key={ticket.id}>{ticket.title}</div>
                    ))
                  ) : (
                    groupedData[key][subKey].length
                  )}
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Ticket List</h2>
      <label>
        Display Mode:{' '}
        <select value={displayMode} onChange={(e) => setDisplayMode(e.target.value)}>
          <option value="user">By User</option>
          <option value="status">By Status</option>
        </select>
      </label>
      {renderTable()}
    </div>
  );
};

export default TicketList;
