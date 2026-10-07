import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Table } from './Table'
import type { TableColumn, TableSort } from './Table'

interface Pull {
    no: number
    name: string
    rank: string
}
const rows: Pull[] = [
    { no: 2, name: 'Banyue', rank: 'S' },
    { no: 10, name: 'Anby', rank: 'A' },
    { no: 1, name: 'Corin', rank: 'A' },
]
const columns: TableColumn<Pull>[] = [
    { key: 'no', header: 'No.', sortable: true },
    {
        key: 'name',
        header: 'Name',
        sortable: true,
        rowHeader: true,
        align: 'start',
    },
    { key: 'rank', header: 'Rank', cell: (r) => <b>{r.rank}</b> },
]
const names = () =>
    screen
        .getAllByRole('row')
        .slice(1)
        .map((r) => within(r).getByRole('rowheader').textContent)

describe('Table', () => {
    it('renders a semantic table with caption, column headers and row headers', () => {
        render(
            <Table
                caption="Signal Search history"
                columns={columns}
                rows={rows}
            />
        )
        const table = screen.getByRole('table', {
            name: 'Signal Search history',
        })
        expect(within(table).getAllByRole('columnheader')).toHaveLength(3)
        expect(within(table).getAllByRole('rowheader')).toHaveLength(3)
        expect(within(table).getAllByRole('row')).toHaveLength(4)
        expect(names()).toEqual(['Banyue', 'Anby', 'Corin'])
        // non-sortable header has no button and no aria-sort
        const rank = screen.getByRole('columnheader', { name: 'Rank' })
        expect(within(rank).queryByRole('button')).toBeNull()
        expect(rank).not.toHaveAttribute('aria-sort')
    })

    it('uncontrolled sort: click toggles ascending / descending and sets aria-sort', async () => {
        const user = userEvent.setup()
        render(<Table caption="h" columns={columns} rows={rows} />)
        const noBtn = screen.getByRole('button', { name: 'No.' })
        await user.click(noBtn)
        expect(
            screen.getByRole('columnheader', { name: 'No.' })
        ).toHaveAttribute('aria-sort', 'ascending')
        expect(names()).toEqual(['Corin', 'Banyue', 'Anby'])
        await user.click(noBtn)
        expect(
            screen.getByRole('columnheader', { name: 'No.' })
        ).toHaveAttribute('aria-sort', 'descending')
        expect(names()).toEqual(['Anby', 'Banyue', 'Corin'])
        await user.click(screen.getByRole('button', { name: 'Name' }))
        expect(
            screen.getByRole('columnheader', { name: 'No.' })
        ).not.toHaveAttribute('aria-sort')
        expect(
            screen.getByRole('columnheader', { name: 'Name' })
        ).toHaveAttribute('aria-sort', 'ascending')
        expect(names()).toEqual(['Anby', 'Banyue', 'Corin'])
    })

    it('sort buttons work from the keyboard', async () => {
        const user = userEvent.setup()
        render(
            <Table
                caption="h"
                columns={columns}
                rows={rows}
                defaultSort={{ key: 'no', direction: 'descending' }}
            />
        )
        expect(names()).toEqual(['Anby', 'Banyue', 'Corin'])
        await user.tab()
        expect(screen.getByRole('button', { name: 'No.' })).toHaveFocus()
        await user.keyboard('{Enter}')
        expect(names()).toEqual(['Corin', 'Banyue', 'Anby'])
    })

    it('controlled sort + manualSort leaves the order to the caller', async () => {
        const user = userEvent.setup()
        const spy = vi.fn()
        function C() {
            const [sort, setSort] = useState<TableSort | null>(null)
            return (
                <Table
                    caption="h"
                    columns={columns}
                    rows={rows}
                    sort={sort}
                    manualSort
                    onSortChange={(s) => {
                        spy(s)
                        setSort(s)
                    }}
                />
            )
        }
        render(<C />)
        await user.click(screen.getByRole('button', { name: 'Name' }))
        expect(spy).toHaveBeenCalledWith({
            key: 'name',
            direction: 'ascending',
        })
        expect(
            screen.getByRole('columnheader', { name: 'Name' })
        ).toHaveAttribute('aria-sort', 'ascending')
        expect(names()).toEqual(['Banyue', 'Anby', 'Corin'])
    })

    it('renders the empty row, bordered class, className and ref', () => {
        let node: HTMLTableElement | null = null
        render(
            <Table
                caption="h"
                hideCaption
                columns={columns}
                rows={[]}
                empty="No records"
                bordered
                className="x"
                ref={(n) => {
                    node = n
                }}
            />
        )
        expect(
            screen.getByRole('cell', { name: 'No records' })
        ).toHaveAttribute('colspan', '3')
        expect(node).toHaveClass('zzz-table', 'zzz-table--bordered', 'x')
        expect(screen.getByText('h')).toHaveClass('zzz-sr-only')
    })
})
