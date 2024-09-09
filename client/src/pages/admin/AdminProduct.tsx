import React, { useState } from 'react'
import { Table, TableProps, Button, Modal, Form, Input, Upload, message, InputRef, Select, Image } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload'
import { Product, SubCategory } from '@/types'
import { useGetAllProductQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetAllSubCategoryQuery } from '@/services'
import { statusProduct } from '@/enum'

import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useGetAllBrandQuery } from '@/services/brand'
import {stringToDateTime } from '@/utils'

const { Option } = Select

const AdminProduct: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  let searchInput: InputRef | null = null

  const { data, error, isLoading } = useGetAllProductQuery()
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const { data: subCategoriesData, isLoading: isLoadingSubCategory } = useGetAllSubCategoryQuery()
  const { data: brandsData, isLoading: isLoadingBrand } = useGetAllBrandQuery()

  const handleCreate = () => {
    setEditingProduct(null)
    form.resetFields()
    setFileList([])
    setIsModalVisible(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    form.setFieldsValue({
      ...product,
      brandId: product.brandId,
      subCategoryId: product.subCategoryId
    })
    setFileList(product.productImages ? product.productImages.map((image, index) => ({ 
      uid: image.id.toString(),
      name: `image-${index}`,
      status: 'done',
      url: image.url,
      thumbUrl: image.url
    })) : [])
    setIsModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(Number(id)).unwrap()
      message.success('Product deleted successfully')
    } catch (err) {
      message.error('Failed to delete product')
    }
  }

  const handleImageDelete = (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
    
    // If the file has an ID (existing image), add it to a list of images to be deleted
    if (file.uid.toString().match(/^\d+$/)) {
      form.setFieldsValue({
        imagesToDelete: [...(form.getFieldValue('imagesToDelete') || []), file.uid],
      });
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData()
        Object.keys(values).forEach(key => {
          if (key === 'images') {
            fileList.forEach((file) => {
              if (file.originFileObj) {
                formData.append(`images`, file.originFileObj)
              }
            })
          } else if (key === 'imagesToDelete') {
            // Convert the array to JSON string and append it as a single value
            formData.append('imagesToDelete', JSON.stringify(values[key] || []))
          } else {
            formData.append(key, values[key])
          }
        })

        if (editingProduct) {
          await updateProduct({ id: Number(editingProduct.id), data: formData }).unwrap()
          message.success('Product updated successfully')
        } else {
          await createProduct(formData).unwrap()
          message.success('Product created successfully')
        }
        setIsModalVisible(false)
        form.resetFields()
        setFileList([])
      } catch (err) {
        message.error('Failed to save product')
      }
    })
  }

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: any) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput?.select(), 100)
      }
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: '#ffc069', padding: 0 }}>
          {text ? text.toString() : ''}
        </span>
      ) : (
        text
      ),
  })

  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      ...getColumnSearchProps('barcode'),
    },
    {
      title: 'Standard Price',
      dataIndex: 'standardPrice',
      key: 'standardPrice',
      sorter: (a, b) => a.standardPrice - b.standardPrice,
    },
    {
      title: 'Brand',
      dataIndex: ['brand', 'name'],
      key: 'brand',
      ...getColumnSearchProps('brand.name'),
    },
    {
      title: 'Sub Category',
      dataIndex: ['subCategory', 'name'],
      key: 'subCategory',
      ...getColumnSearchProps('subCategory.name'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: any) => text === statusProduct.ACTIVE ? 'Active' : 'Inactive'
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: any) => stringToDateTime(text)
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: any) => stringToDateTime(text)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
        </div>
      ),
    },
  ]

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Button icon={<PlusOutlined />} onClick={handleCreate} className="mb-4">
        Add Product
      </Button>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => record.id}
        loading={isLoading&& isLoadingBrand}
        className="bg-white shadow-md rounded-lg"
      />
      <Modal
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        className="custom-modal"
        footer={null}
        centered
      >
        <div className="bg-white p-4">
          <h2 className="text-2xl font-bold mb-6 text-primary">
            {editingProduct ? 'Edit Product' : 'Create Product'}
          </h2>
          <Form form={form} layout="vertical" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
                <Input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
              </Form.Item>
              <Form.Item name="barcode" label="Barcode" rules={[{ required: true, message: 'Please enter a barcode' }]}>
                <Input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
              </Form.Item>
            </div>
            <Form.Item name="description" label="Description">
              <Input.TextArea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" rows={4} />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="standardPrice" label="Standard Price" rules={[{ required: true, message: 'Please enter a standard price' }]}>
                <Input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
              </Form.Item>
              <Form.Item name="brandId" label="Brand" rules={[{ required: true, message: 'Please select a brand' }]}>
                <Select className="w-full">
                  {brandsData?.data.map((brand) => (
                    <Option key={brand.id} value={brand.id}>{brand.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="subCategoryId" label="Sub Category" rules={[{ required: true, message: 'Please select a sub category' }]}>
                <Select className="w-full">
                  {subCategoriesData?.data.map((subCategory: SubCategory) => (
                    <Option key={subCategory.id} value={subCategory.id}>{subCategory.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              {editingProduct && (
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status' }]}>
                  <Select className="w-full">
                    {Object.values(statusProduct).map((status) => (
                      <Option key={status} value={status}>{status}</Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </div>
            <Form.Item name="images" label="Images">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                accept="image/*"
                multiple
                onPreview={handlePreview}
                onRemove={handleImageDelete}
                className="upload-list-inline"
              >
                {fileList.length >= 8 ? null : (
                  <div className="flex flex-col items-center justify-center">
                    <PlusOutlined className="text-2xl text-primary" />
                    <div className="mt-2">Upload</div>
                  </div>  
                )}
              </Upload>
            </Form.Item>
            <Form.Item name="imagesToDelete" hidden>
              <Input type="hidden" />
            </Form.Item>
            <div className="flex justify-end space-x-4 mt-6">
              <Button onClick={() => setIsModalVisible(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
              <Button onClick={handleModalOk} type="primary" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export { AdminProduct }