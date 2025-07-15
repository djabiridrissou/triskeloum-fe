// src/pages/UnderConstruction.tsx
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { ToolOutlined, HomeOutlined } from "@ant-design/icons";

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <Result
      icon={<ToolOutlined style={{ color: '#faad14' }} />}
      title="Page en construction"
      subTitle="Cette page est actuellement en cours de développement. Nous travaillons dur pour vous offrir une expérience exceptionnelle. Veuillez revenir bientôt !"
      extra={[
        <Button 
          type="primary" 
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
          key="home"
        >
          Retour à l'accueil
        </Button>,
        <Button 
          onClick={() => navigate(-1)}
          key="back"
        >
          Page précédente
        </Button>
      ]}
    />
  );
};

export default UnderConstruction;