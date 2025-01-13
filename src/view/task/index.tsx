import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "@/components/loading";
import { Container } from '@/components/box';

export default function Task() {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-3rem)]">
      {loading && (
        <div className="fixed inset-0 z-50">
          <Loading loading={loading} type="fullscreen" />
        </div>
      )}
      <Container className="h-full overflow-hidden">
        <iframe 
          src="https://mini-doge.com/memes" 
          className="w-full h-full border-0"
        />
      </Container>
    </div>
  );
}
