import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

function HelloWorld() {
  return <div>Hello World</div>;
}

describe('HelloWorld component', () => {
  it('deve renderizar o texto', () => {
    render(<HelloWorld />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
}); 