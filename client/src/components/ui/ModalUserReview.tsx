import React, { useState } from 'react'
import { Modal, Rate, Input, Upload, Button, UploadProps, Form } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'
import { useCreateReviewMutation } from '@/services/review'
import { showToast } from './MyToast'
type UploadFile = UploadProps['fileList']

const ModalUserReview: React.FC<{
  open: boolean
  onClose: () => void
  orderItemId: number
  productId: number
  refetch: any
}> = ({ open, onClose, orderItemId, refetch }) => {
  const [form] = useForm()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [fileList, setFileList] = useState<UploadFile>([])

  const [createReview, { isLoading, error }] = useCreateReviewMutation()

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      try {
        if (!fileList) return
        const formData = new FormData()
        formData.append('rating', values.rating.toString())
        formData.append('comment', values.review)
        formData.append('orderItemId', orderItemId.toString())
        fileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append('mediaFiles', file.originFileObj)
          }
        })
        await createReview(formData).unwrap()
        if (refetch) {
          refetch()
        }
        showToast.success('Review created successfully')

        onClose()
      } catch (err: any) {
        showToast.error(err.data.message || 'Failed to create review')
      }
    })
  }

  const handlePreview = async (file: any) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const isVideo = file.type.startsWith('video')
    const previewWindow = window.open(src)
    if (isVideo) {
      previewWindow?.document.write(
        `<video src="${src}" controls autoplay style="width: 100%; height: 100%;"></video>`
      )
    } else {
      previewWindow?.document.write(
        `<img src="${src}" style="width: 100%; height: 100%;" />`
      )
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className='rounded-lg shadow-lg'
    >
      <div className='flex flex-col items-center px-4 py-2'>
        <h3 className='text-lg font-semibold mb-4'>How would you rate us?</h3>
        <Form form={form} className='w-full' layout='vertical'>
          <Form.Item
            name='rating'
            label='Rating'
            rules={[{ required: true, message: 'Please rate us' }]}
          >
            <Rate onChange={setRating} value={rating} allowClear={false} />
          </Form.Item>
          <Form.Item
            name='review'
            label='Review'
            rules={[{ required: true, message: 'Please write your review' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder='Write your review...'
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className='my-4 border rounded-md'
            />
          </Form.Item>
          <Form.Item name='file' label='File'>
            <Upload
              fileList={fileList as UploadFile}
              onChange={({ fileList }) => setFileList(fileList as UploadFile)}
              beforeUpload={() => false}
              accept='.jpg,.jpeg,.png,.mp4,.mov'
              multiple
              onPreview={handlePreview}
              listType='picture-card'
            >
              <button className='flex items-center justify-center w-full h-full'>
                <UploadOutlined />
              </button>
            </Upload>
          </Form.Item>
        </Form>
        <Button
          type='primary'
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          Submit review
        </Button>
      </div>
    </Modal>
  )
}

export { ModalUserReview }
