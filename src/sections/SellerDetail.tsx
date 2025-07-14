interface SellerDetailsProps {
    seller: {
      _id: string;
      name: string;
      socialReason: string;
      rccmNumber: string;
      nifNumber: string;
      address: string;
      phoneNumber: string;
      country: string;
      email: string;
      representativeName: string;
      representativeBirthDate: string;
      representativeBirthPlace: string;
      representativeIdType: string;
      representativeIdNumber: string;
      currency: string;
      canLogin: boolean;
      isValidated: boolean;
      createdAt: string;
      updatedAt: string;
      representativeId: {
        _id: string;
        name: string;
        designation: string;
        email: string;
        phoneNumber: string;
        isActive: boolean;
        canLogin: boolean;
      };
      representativeIdFront?: string;
      representativeIdBack?: string;
    };
  }
  
  const SellerDetail = ({ seller }: SellerDetailsProps) => {
    const baseUrl = import.meta.env.VITE_BASE_WITHOUT_ORIGIN;
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Section 1: Informations du fournisseur */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Informations du fournisseur</h3>
          <div className="space-y-3">
            <DetailItem label="Nom" value={seller.name} />
            <DetailItem label="Raison sociale" value={seller.socialReason} />
            <DetailItem label="RCCM" value={seller.rccmNumber} />
            <DetailItem label="NIF" value={seller.nifNumber} />
            <DetailItem label="Adresse" value={seller.address} />
            <DetailItem label="Pays" value={seller.country} />
            <DetailItem label="Téléphone" value={seller.phoneNumber} />
            <DetailItem label="Email" value={seller.email} />
            <DetailItem label="Devise" value={seller.currency} />
          {/*   <DetailItem 
              label="Statut" 
              value={seller.isValidated ? "Validé" : "En attente"} 
              highlight={!seller.isValidated}
            /> */}
          </div>
        </div>
  
        {/* Section 2: Représentant et documents */}
        <div className="space-y-4">
          {/* Informations du représentant */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Représentant légal</h3>
            <DetailItem label="Nom complet" value={seller.representativeName} />
            <DetailItem 
              label="Date de naissance" 
              value={new Date(seller.representativeBirthDate).toLocaleDateString()} 
            />
            <DetailItem label="Lieu de naissance" value={seller.representativeBirthPlace} />
            <DetailItem label="Type de pièce" value={seller.representativeIdType} />
            <DetailItem label="Numéro de pièce" value={seller.representativeIdNumber} />
            {/* <DetailItem 
              label="Statut compte" 
              value={seller.representativeId.canLogin ? "Actif" : "Inactif"} 
              highlight={!seller.representativeId.canLogin}
            /> */}
          </div>
  
          {/* Documents */}
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {seller.representativeIdFront && (
                <DocumentPreview 
                  label={`${seller.representativeIdType} Recto`}
                  url={`${baseUrl}/${seller.representativeIdFront}`}
                />
              )}
              {seller.representativeIdBack && (
                <DocumentPreview 
                  label={`${seller.representativeIdType} Verso`}
                  url={`${baseUrl}/${seller.representativeIdBack}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Composant helper pour afficher un détail
  const DetailItem = ({ 
    label, 
    value,
    highlight = false
  }: {
    label: string;
    value: string | number;
    highlight?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-500">{label}</label>
      <p className={`mt-1 text-sm ${highlight ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
        {value || 'Non renseigné'}
      </p>
    </div>
  );
  
  // Composant helper pour prévisualiser les documents
  const DocumentPreview = ({ label, url }: { label: string; url: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-500">{label}</label>
      <div className="mt-1 border rounded-md overflow-hidden">
        <img 
          src={url} 
          alt={label} 
          className="w-full h-auto object-contain max-h-40"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-document.png';
          }}
        />
      </div>
    </div>
  );
  
  export default SellerDetail;