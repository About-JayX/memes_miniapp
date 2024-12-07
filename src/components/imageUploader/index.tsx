import {
  Button,
  Grid,
  ImageUploader as ImageUploaders,
  type ImageUploadItem,
} from 'antd-mobile'
import { useTranslation } from 'react-i18next'

import Icon from '../icon'
export default function ImageUploader({
  value = [],
  onChange,
  upload,
}: {
  value: ImageUploadItem[]
  onChange?: (items: ImageUploadItem[]) => void
  upload: (file: File) => Promise<ImageUploadItem>
}) {
  const { t } = useTranslation()
  return (
    <ImageUploaders
      style={{ '--cell-size': '150px' }}
      imageFit="cover"
      maxCount={1}
      value={value}
      onChange={onChange}
      upload={upload}
    >
      <div className="h-[150px] w-[150px] bg-[--primary-card-body-color] rounded-xl border border-dashed border-white/10 flex items-center justify-center">
        <Grid columns={1} gap={8} className="justify-items-center">
          <Grid.Item>
            <Icon name="upload" className="w-[36px]" />
          </Grid.Item>
          <Grid.Item className="text-sm font-normal">
            <Grid columns={1} gap={0} className="justify-items-center">
              <Grid.Item>{t('public.dragAndDrop')}</Grid.Item>
              <Grid.Item>{t('public.or')}</Grid.Item>
            </Grid>
          </Grid.Item>
          <Grid.Item>
            <Button size="small">{t('public.browseFile')}</Button>
          </Grid.Item>
        </Grid>
      </div>
    </ImageUploaders>
  )
}
