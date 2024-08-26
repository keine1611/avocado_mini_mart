import React from 'react'
import { Table, TableProps } from 'antd'
import { Brand } from '@/types'
import { useGetAllBrandQuery } from '@/services/brand'

const comlumn: TableProps<Brand>['columns'] = [
  {
    title: 'Logo',
    dataIndex: 'logo',
    key: 'logo',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Slug',
    dataIndex: 'slug',
    key: 'slug',
  },
  {
    title: 'Descriptions',
    dataIndex: 'desciption',
    key: 'description',
  },
]

export const AdminBrand: React.FC = () => {
  const { data, error, isLoading } = useGetAllBrandQuery()

  return (
    <div className=' w-full h-full overflow-y-auto'>
      <Table
        columns={comlumn}
        dataSource={data?.data}
        rowKey={(record) => record.id}
      />
    </div>
  )
}
