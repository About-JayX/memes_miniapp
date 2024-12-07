import { Button, Grid } from "antd-mobile";

import Icon from "@/components/icon";
import Popup from "@/components/popup";
import { walletChainData } from "@/config/chain";


export const ChainItem = ({
  name = "",
  title = "",
}: {
  name?: string;
  title?: string;
}) => {
  return (
    <Grid.Item className="bg-[--primary-card-body-color] rounded-xl p-3 flex items-center gap-[10px] shadow-[0_0_4px_0_rgba(0_0_0_0.02)] backdrop-blur-[45px] text-sm font-medium">
      <Icon name={`chain/${name}`} className="w-[28px] h-[28px]" /> {title}
    </Grid.Item>
  );
};

export default function Chain({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <Popup
      visible={open}
      onClose={onClose}
      title="Networks"
      footer={<Button color="primary">Add A Netwroks</Button>}
    >
      <Grid columns={1} gap={12}>
        {walletChainData.map((item, index) => (
          <ChainItem key={index} {...item} />
        ))}
      </Grid>
    </Popup>
  );
}
