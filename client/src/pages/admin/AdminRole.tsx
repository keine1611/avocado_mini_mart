import { useEffect, useRef, useState } from 'react'
import { useGetAllRoleQuery, useUpdateRoleMutation } from '@/services'
import { ColumnType } from 'antd/es/table'
import { Permission, Role } from '@/types'
import { Button, Input, Form, Modal, Table, Select } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useGetAllPermissionQuery } from '@/services/permission'
import { showToast } from '@/components/ui/MyToast'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Loading } from '@/components'

const AdminRole: React.FC = () => {
  const { data: roles, isLoading: isLoadingRoles } = useGetAllRoleQuery()
  const [editRole, setEditRole] = useState<Role | null>(null)
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const handleEdit = (record: Role) => {
    setEditRole(record)
    setOpenModalEdit(true)
  }

  const handleDelete = (id: number) => {
    return
  }
  const handleCloseModalEdit = () => {
    setEditRole(null)
    setOpenModalEdit(false)
  }

  const columns: ColumnType<Role>[] = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleEdit(record)}
            className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
          >
            <EditOutlined className='text-primary' />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className=' btn btn-square btn-sm border border-red-500 text-red-500 hover:border hover:border-red-500 hover:text-red-500'
          >
            <DeleteOutlined className='text-red-500' />
          </button>
        </div>
      ),
    },
  ]
  return (
    <>
      <Table
        columns={columns}
        dataSource={roles?.data}
        loading={isLoadingRoles}
        rowKey='id'
      />
      <AdminRoleModal
        open={openModalEdit}
        onClose={handleCloseModalEdit}
        role={editRole || undefined}
      />
    </>
  )
}

const AdminRoleModal: React.FC<{
  open: boolean
  onClose: () => void
  role?: Role
}> = ({ open, onClose, role }) => {
  const [form] = Form.useForm()
  const { data: permissions, isLoading: isLoadingPermissions } =
    useGetAllPermissionQuery()
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  )
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation()
  const searchInput = useRef<typeof Input | null>(null)
  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.rolePermissions.map((rp) => rp.permission))
      form.setFieldValue('name', role.name)
    }
  }, [role])

  const handleAddPermission = (permission: Permission) => {
    const permissionExist = selectedPermissions.find(
      (p) => p.name === permission.name
    )
    if (!permissionExist) {
      setSelectedPermissions([...selectedPermissions, permission])
    } else {
      showToast.error('Permission already exists')
    }
  }

  const handleRemovePermission = (permission: Permission) => {
    setSelectedPermissions(
      selectedPermissions.filter((p) => p.name !== permission.name)
    )
  }

  const handleSubmit = async () => {
    await form.validateFields()
    if (!role) return
    try {
      await updateRole({
        id: role.id,
        name: form.getFieldValue('name'),
        permissions: selectedPermissions.map((p) => p.name),
      }).unwrap()
      onClose()
    } catch (error: any) {
      showToast.error(error.data.message || 'Something went wrong')
    }
  }

  const getColumnSearchProps = (
    dataIndex: string,
    isSelect: boolean = false,
    options: {
      label: string
      value: string
      render: () => React.ReactNode
    }[] = []
  ) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        {isSelect ? (
          <Select
            showSearch
            style={{ width: 200, marginBottom: 8, display: 'block' }}
            placeholder={`Select ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            onSearch={(value) => setSelectedKeys(value ? [value] : [])}
            filterOption={(input, option) => {
              if (option && option.label) {
                return option.label
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              return false
            }}
          >
            {options.map((option) => (
              <Select.Option
                key={option.value}
                label={option.label}
                value={option.value}
              >
                {option.render()}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Input
            ref={(node) => {
              searchInput.current = node as any
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(confirm)}
            style={{ marginBottom: 8, display: 'block' }}
          />
        )}
        <Button
          type='primary'
          onClick={() => handleSearch(confirm)}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size='small'
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      isSelect
        ? record[dataIndex] === value
        : record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => {
          if (searchInput.current && 'select' in searchInput.current) {
            ;(searchInput.current as any).select()
          }
        }, 100)
      }
    },
  })

  const handleSearch = (confirm: () => void) => {
    confirm()
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
  }

  const columns: ColumnType<Permission>[] = [
    { title: 'Name', dataIndex: 'name', ...getColumnSearchProps('name') },
    { title: 'Path', dataIndex: 'path', ...getColumnSearchProps('path') },
    {
      title: 'Method',
      dataIndex: 'method',
      width: 150,
      ...getColumnSearchProps('method', true, [
        { label: 'GET', value: 'GET', render: () => <p>GET</p> },
        { label: 'POST', value: 'POST', render: () => <p>POST</p> },
        { label: 'PUT', value: 'PUT', render: () => <p>PUT</p> },
        { label: 'DELETE', value: 'DELETE', render: () => <p>DELETE</p> },
      ]),
    },
    {
      title: 'Is Public',
      dataIndex: 'isPublic',
      width: 100,
      render: (_, record) => (
        <p className='text-center'>{record.isPublic ? 'Yes' : 'No'}</p>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      render: (_, record) => (
        <div className='flex items-center gap-2 w-full justify-center'>
          <button
            onClick={() => handleRemovePermission(record)}
            className=' btn btn-square btn-sm border border-red-500 text-red-500 hover:border hover:border-red-500 hover:text-red-500'
          >
            <DeleteOutlined className='text-red-500' />
          </button>
        </div>
      ),
    },
  ]

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onClose={onClose}
      centered
      width={1300}
      footer={null}
    >
      <div className='flex justify-between items-center mt-10 w-full'>
        <Form form={form} className='w-full' layout='vertical'>
          <Form.Item name='name' label='Name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='permissions'
            label='Permissions'
            rules={[{ required: false }]}
          >
            <Select
              value={null}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseEnter={(e) => e.stopPropagation()}
              filterOption={(input, option) => {
                return (option?.label ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toString().toLowerCase())
              }}
              showSearch
              className='w-full'
              dropdownRender={() => (
                <div className='w-full px-2 h-[280px] overflow-y-auto flex flex-col gap-2'>
                  {permissions?.data.map((permission) => {
                    const isPermissionSelected = selectedPermissions.some(
                      (p) => p.name === permission.name
                    )
                    return (
                      <div
                        key={permission.name}
                        className='flex flex-row gap-2 justify-between px-4 items-center'
                      >
                        <p>{permission.name}</p>
                        <button
                          onClick={() => handleAddPermission(permission)}
                          className='btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
                          disabled={isPermissionSelected}
                        >
                          <PlusOutlined />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            />
          </Form.Item>
          <Table
            dataSource={selectedPermissions}
            loading={isLoadingPermissions}
            scroll={{ y: 220 }}
            pagination={false}
            className='w-full min-h-[300px]'
            columns={columns}
            rowKey='name'
          />
        </Form>
      </div>
      <div className='flex justify-end gap-2'>
        <button className='btn btn-sm btn-outline' onClick={onClose}>
          Cancel
        </button>
        <button
          className='btn btn-sm btn-primary disabled:btn-disabled min-w-[100px]'
          onClick={handleSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loading size='loading-sm' />
          ) : (
            <span className='text-white'>Update</span>
          )}
        </button>
      </div>
    </Modal>
  )
}

export { AdminRole }
