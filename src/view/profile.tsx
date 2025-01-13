import { Grid } from "antd-mobile";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/box";
import Lang from "@/components/lib/userHeader/lang";
import { ProfileList } from "@/components/lib/userHeader/profile";

export default function Profile() {
  const { t } = useTranslation();
  const [langStatus, setLangStatus] = useState<boolean>(false);

  return (
    <Fragment>
      <Lang open={langStatus} onClose={() => setLangStatus(false)} />
      <Container className="h-[calc(100vh-3rem)] overflow-hidden relative">
        <Grid columns={1} gap={20}>
          <Grid.Item className="text-center text-2xl font-bold">
            {t("public.profile")}
          </Grid.Item>
          <Grid.Item>
            <ProfileList setLangStatus={()=>setLangStatus(true)} />
          </Grid.Item>
        </Grid>
      </Container>
    </Fragment>
  );
}
