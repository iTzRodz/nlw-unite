import { Search, MoreHorizontal, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useState } from 'react'
import { attendees } from '../data/attendees'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')
export function AttendeeList() {
  const [search, setSearch] = useState<string | null>('')
  const [page, setPage] = useState(1)
  const totalPage = Math.ceil(attendees.length / 10 )

  function onSearchInputChanged(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
  }

  function nextPage() {
    setPage(page + 1)
  }

  function previousPage() {
    setPage(page - 1)
  }

  function firstPage() {
    setPage(1)
  }

  function lastPage() {
    setPage(totalPage)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 py-1.5 w-72 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
            type="text"
            placeholder="Buscar participante..."
            className="bg-transparent flex-1 outline-none  border-0 p-0 text-sm"
            onChange={(e) => onSearchInputChanged(e)}
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }} className="py-3 px-4 text-sm font-semibold text-left">
              {' '}
              <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10'></input>{' '}
            </TableHeader>
            <TableHeader>
              {' '}
              Codigo
            </TableHeader>
            <TableHeader>
              {' '}
              Participante{' '}
            </TableHeader>
            <TableHeader>
              {' '}
              Data da inscrição{' '}
            </TableHeader>
            <TableHeader>
              {' '}
              Data do check-in{' '}
            </TableHeader>
            <th style={{ width: 64 }} className="py-3 px-4 text-sm font-semibold text-left"></th>
          </tr>
        </thead>
        <tbody>
          {attendees.slice((page - 1) * 10,  page * 10).map((attendee) => {
            return (
              <TableRow className="border-b border-white/10 hover:bg-white/5" key={attendee.id}>
                <TableCell>
                  <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10'></input>
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">{attendee.name}</span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {
                    dayjs().to(attendee.createdAt)
                  }
                </TableCell>
                <TableCell>
                  {
                    dayjs().to(attendee.checkedInAt)
                  }
                </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className='size-4' />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3} className="py-3 px-4 text-sm text-zinc-300">
              Mostrando 10 de {attendees.length}
            </TableCell>
            <TableCell
              colSpan={3}
              className="py-3 px-4 text-sm text-zinc-300 text-right"
            >
              <div className='inline-flex items-center gap-8'>
                <span> Pagina {page} de {totalPage}</span>

                <div className='flex gap-1.5'>
                  <IconButton onClick={firstPage} disabled={page === 1}>
                    <ChevronsLeft className='size-4' />
                  </IconButton>

                  <IconButton onClick={previousPage} disabled={page === 1}>
                    <ChevronLeft className='size-4' />
                  </IconButton>

                  <IconButton onClick={nextPage} disabled={page === totalPage}>
                    <ChevronRight className='size-4' />
                  </IconButton>

                  <IconButton onClick={lastPage} disabled={page === totalPage}>
                    <ChevronsRight className='size-4' />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
