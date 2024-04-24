import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Search } from 'lucide-react';

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form inline>
      <InputGroup className='pl-2' style={{ alignItems: 'center' }}>
        <Form.Control
          type='text'
          name='q'
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search Products...'
          style={{
            color: 'white',
            outline: '#f0b90b',
            backgroundColor: '#1e2329',
            border: '1px solid #f0b90b',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '1rem',
            fontWeight: '900',
          }}
        />
        <InputGroup.Append>
          <Button type='submit' onClick={submitHandler} style={{ backgroundColor: '#1e2329', border: 'none' }}>
            <Search style={{ color: '#f0b90b' }} />
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
