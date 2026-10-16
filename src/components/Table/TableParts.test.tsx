import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableEmpty,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TableToolbar,
} from '.';

function Roster(props: { stickyHeader?: boolean; caption?: string }) {
  return (
    <Table caption={props.caption ?? 'Agent roster'} stickyHeader={props.stickyHeader}>
      <TableHead>
        <TableRow>
          <TableCell>Agent</TableCell>
          <TableCell align="end">Level</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow selected>
          <TableCell scope="row">Ellen</TableCell>
          <TableCell align="end">60</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row">Lycaon</TableCell>
          <TableCell align="end">55</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell scope="row">Total</TableCell>
          <TableCell align="end">115</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe('Table parts', () => {
  it('render header cells in the head, row headers with scope="row", and data cells elsewhere', () => {
    render(<Roster />);
    const table = screen.getByRole('table', { name: 'Agent roster' });
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((c) => c.textContent)
    ).toEqual(['Agent', 'Level']);
    expect(
      within(table)
        .getAllByRole('rowheader')
        .map((c) => c.textContent)
    ).toEqual(['Ellen', 'Lycaon', 'Total']);
    expect(
      within(table)
        .getAllByRole('cell')
        .map((c) => c.textContent)
    ).toEqual(['60', '55', '115']);
    expect(screen.getByRole('columnheader', { name: 'Agent' })).toHaveAttribute('scope', 'col');
  });

  it('marks a selected row', () => {
    render(<Roster />);
    expect(screen.getByRole('rowheader', { name: 'Ellen' }).closest('tr')).toHaveAttribute('data-selected');
    expect(screen.getByRole('rowheader', { name: 'Lycaon' }).closest('tr')).not.toHaveAttribute('data-selected');
  });

  it('a header cell reports its sort with aria-sort', () => {
    render(
      <Table caption="h">
        <TableHead>
          <TableRow>
            <TableCell sortDirection="descending">ATK</TableCell>
            <TableCell sortDirection={false}>Agent</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: 'ATK' })).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getByRole('columnheader', { name: 'Agent' })).not.toHaveAttribute('aria-sort');
  });

  it('TableSortLabel is a button that shows its direction only while active', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <TableSortLabel active direction="descending" onClick={onClick}>
          ATK
        </TableSortLabel>
        <TableSortLabel direction="descending">Level</TableSortLabel>
      </>
    );
    expect(screen.getByRole('button', { name: 'ATK' })).toHaveAttribute('data-direction', 'descending');
    expect(screen.getByRole('button', { name: 'Level' })).not.toHaveAttribute('data-direction');
    await user.click(screen.getByRole('button', { name: 'ATK' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('TableEmpty is one row whose cell spans the columns', () => {
    render(
      <Table caption="h">
        <TableBody>
          <TableEmpty colSpan={4}>No agents match these filters</TableEmpty>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole('cell', { name: 'No agents match these filters' })).toHaveAttribute('colspan', '4');
  });
});

describe('Column widths', () => {
  it('reads a numeric cell width as design units and passes a string through', () => {
    render(
      <Table caption="h">
        <TableHead>
          <TableRow>
            <TableCell width={220}>Agent</TableCell>
            <TableCell width="20%">Faction</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: 'Agent' }).style.width).toBe('calc(220 * var(--zzz-px))');
    expect(screen.getByRole('columnheader', { name: 'Faction' }).style.width).toBe('20%');
  });

  it('sets the table layout and the minimum width before it scrolls sideways', () => {
    render(<Table caption="h" layout="fixed" minWidth={900} />);
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('data-layout', 'fixed');
    expect(table.style.minWidth).toBe('calc(900 * var(--zzz-px))');
  });
});

describe('Cell overflow', () => {
  const cell = (
    <Table caption="h">
      <TableBody>
        <TableRow>
          <TableCell overflow="truncate">Victoria Housekeeping Co.</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  it('a truncated cell that fits is not a tab stop and has no tooltip', async () => {
    const user = userEvent.setup();
    render(cell);
    await user.tab();
    expect(document.body).toHaveFocus();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('a truncated cell that is cut off can be focused to show its full text', async () => {
    const width = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(300);
    const client = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
    try {
      const user = userEvent.setup();
      render(cell);
      await user.tab();
      expect(screen.getByText('Victoria Housekeeping Co.', { selector: 'span' })).toHaveFocus();
      expect(screen.getByRole('tooltip')).toHaveTextContent('Victoria Housekeeping Co.');
    } finally {
      width.mockRestore();
      client.mockRestore();
    }
  });
});

describe('TableContainer', () => {
  it('reads height as design units, or passes a CSS length through for maxHeight', () => {
    const { container, rerender } = render(<TableContainer height={630} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-bounded', 'height');
    expect(root.style.getPropertyValue('--zzz-table-container-h')).toBe('calc(630 * var(--zzz-px))');
    rerender(<TableContainer maxHeight="min(70dvh, 640px)" />);
    expect(root).toHaveAttribute('data-bounded', 'max');
    expect(root.style.getPropertyValue('--zzz-table-container-h')).toBe('min(70dvh, 640px)');
    rerender(<TableContainer />);
    expect(root).not.toHaveAttribute('data-bounded');
  });

  it('scrolls the table in a region named by its caption', () => {
    render(
      <TableContainer height={630}>
        <Roster />
      </TableContainer>
    );
    const region = screen.getByRole('region', { name: 'Agent roster' });
    expect(within(region).getByRole('table')).toBeInTheDocument();
  });

  it('a table outside a container has no scroll region', () => {
    render(<Roster />);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('pins the header by default once the height is bounded', () => {
    const { rerender } = render(
      <TableContainer height={630}>
        <Roster />
      </TableContainer>
    );
    expect(screen.getByRole('table')).toHaveAttribute('data-sticky');
    rerender(
      <TableContainer maxHeight={630}>
        <Roster stickyHeader={false} />
      </TableContainer>
    );
    expect(screen.getByRole('table')).not.toHaveAttribute('data-sticky');
    rerender(
      <TableContainer>
        <Roster />
      </TableContainer>
    );
    expect(screen.getByRole('table')).not.toHaveAttribute('data-sticky');
  });
});

describe('TableToolbar', () => {
  it('shows the title, or the selected count when rows are selected', () => {
    const { rerender } = render(
      <TableToolbar title="Agent roster" description="Pick up to 3 agents.">
        <button type="button">Deploy squad</button>
      </TableToolbar>
    );
    expect(screen.getByText('Agent roster')).toBeInTheDocument();
    expect(screen.getByText('Pick up to 3 agents.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deploy squad' })).toBeInTheDocument();
    rerender(<TableToolbar title="Agent roster" selectedCount={2} />);
    expect(screen.queryByText('Agent roster')).toBeNull();
    expect(screen.getByText('2').parentElement).toHaveTextContent('2 selected');
  });
});

describe('TablePagination', () => {
  const pickRows = async (user: ReturnType<typeof userEvent.setup>, label: string) => {
    await user.click(screen.getByRole('combobox', { name: 'Rows per page' }));
    await user.click(screen.getByRole('option', { name: label }));
  };

  it('shows the range of rows on the current page', () => {
    render(<TablePagination count={24} page={2} rowsPerPage={10} />);
    expect(screen.getByText('11–20 of 24')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('shows an empty range when there are no rows', () => {
    render(<TablePagination count={0} rowsPerPage={10} />);
    expect(screen.getByText('0–0 of 0')).toBeInTheDocument();
  });

  it('pages forward on its own when uncontrolled and reports the page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<TablePagination count={24} defaultRowsPerPage={10} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText('11–20 of 24')).toBeInTheDocument();
  });

  it('changing rows per page reports the new size and goes back to page 1', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    const onPage = vi.fn();
    function C() {
      const [page, setPage] = useState(2);
      const [rows, setRows] = useState(10);
      return (
        <TablePagination
          count={24}
          page={page}
          rowsPerPage={rows}
          rowsPerPageOptions={[10, 25]}
          onPageChange={(p) => {
            onPage(p);
            setPage(p);
          }}
          onRowsPerPageChange={(r) => {
            onRows(r);
            setRows(r);
          }}
        />
      );
    }
    render(<C />);
    await pickRows(user, '25');
    expect(onRows).toHaveBeenCalledWith(25);
    expect(onPage).toHaveBeenCalledWith(1);
    expect(screen.getByText('1–24 of 24')).toBeInTheDocument();
  });

  it('an All option puts every row on one page', async () => {
    const user = userEvent.setup();
    const onRows = vi.fn();
    render(
      <TablePagination
        count={24}
        defaultRowsPerPage={10}
        rowsPerPageOptions={[10, { label: 'All', value: -1 }]}
        onRowsPerPageChange={onRows}
      />
    );
    await pickRows(user, 'All');
    expect(onRows).toHaveBeenCalledWith(-1);
    expect(screen.getByText('1–24 of 24')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Page 2' })).toBeNull();
  });

  it('hides the rows-per-page select when there are no options', () => {
    render(<TablePagination count={24} rowsPerPage={10} rowsPerPageOptions={[]} />);
    expect(screen.queryByRole('combobox')).toBeNull();
  });
});

// The cut-off check runs again when the cell resizes; jsdom has no ResizeObserver, so a stub hands us its callback.
describe('Cell overflow after a resize', () => {
  it('starts showing the full text once a resize cuts the cell off', () => {
    const observers: ResizeObserverCallback[] = [];
    const RO = vi.fn(function (this: unknown, cb: ResizeObserverCallback) {
      observers.push(cb);
      return { observe() {}, unobserve() {}, disconnect() {} };
    });
    vi.stubGlobal('ResizeObserver', RO);
    try {
      render(
        <Table caption="h">
          <TableBody>
            <TableRow>
              <TableCell overflow="truncate">Belobog Heavy Industries</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const span = screen.getByText('Belobog Heavy Industries', { selector: 'span' });
      expect(span).not.toHaveAttribute('tabindex');
      Object.defineProperty(span, 'scrollWidth', { configurable: true, value: 300 });
      Object.defineProperty(span, 'clientWidth', { configurable: true, value: 120 });
      act(() => observers.forEach((cb) => cb([], {} as ResizeObserver)));
      expect(span).toHaveAttribute('tabindex', '0');
      fireEvent.focus(span);
      expect(screen.getByRole('tooltip')).toHaveTextContent('Belobog Heavy Industries');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
