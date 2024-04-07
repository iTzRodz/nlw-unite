import { Search, MoreHorizontal, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}

export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())
   
    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())
   
    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })
  // const page = 1
  const [total, setTotal] = useState(0)
  const totalPage = Math.ceil(total / 10 )

  useEffect(() => {
    const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')
    url.searchParams.set('pageIndex', String(page - 1))
    if (search.length > 0) {
      url.searchParams.set('query', search)
    }

    fetch(url)
    .then(response => (response.json()))
    .then(data => {
      setAttendees(data.attendees)
      setTotal(data.total)
    })    
  }, [page, search])

  function onSearchInputChanged(e: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(e.target.value)
    setCurrentPage(1)
  }

  function nextPage() {
   setCurrentPage(page + 1)
  }

  function previousPage() {
    setCurrentPage(page - 1)
  }

  function firstPage() {
    setCurrentPage(1)
  }

  function lastPage() {
    setCurrentPage(totalPage)
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    
    window.history.pushState({}, '', url)
    setPage(page)
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', search)
    
    window.history.pushState({}, '', url)
    setSearch(search)
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
            className="bg-transparent flex-1 outline-none  border-0 p-0 text-sm focus:ring-0"
            value={search}
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
          {attendees.map((attendee) => {
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
                    attendee.checkedInAt === null ? <span className='text-zinc-400'> Não fez check-in </span> 
                    : dayjs().to(attendee.checkedInAt)
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
              Mostrando {attendees.length} de {total}
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
