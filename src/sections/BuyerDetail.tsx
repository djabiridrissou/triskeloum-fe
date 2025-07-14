
interface BuyerDetailsProps {
  buyer: any;
}

const BuyerDetails = ({ buyer }: BuyerDetailsProps) => {
  const baseUrl = import.meta.env.VITE_BASE_WITHOUT_ORIGIN;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Section 1: Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Informations principales</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-500">Raison sociale</label>
            <p className="mt-1 text-sm text-gray-900">{buyer.socialReason}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-sm text-gray-900">{buyer.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Téléphone</label>
            <p className="mt-1 text-sm text-gray-900">{buyer.phoneNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Pays</label>
            <p className="mt-1 text-sm text-gray-900">{buyer.country}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Adresse</label>
            <p className="mt-1 text-sm text-gray-900">{buyer.address}</p>
          </div>
        </div>
      </div>

      {/* Section 2: Documents et représentant */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Documents</h3>
        <div className="grid grid-cols-2 gap-4">
          {buyer.cniFront && (
            <div>
              <label className="block text-sm font-medium text-gray-500">CNI Recto</label>
              <img 
                src={`${baseUrl}/${buyer.cniFront}`} 
                alt="CNI Recto" 
                className="mt-1 w-full h-auto border rounded"
              />
            </div>
          )}
          {buyer.cniBack && (
            <div>
              <label className="block text-sm font-medium text-gray-500">CNI Verso</label>
              <img 
                src={`${baseUrl}/${buyer.cniBack}`} 
                alt="CNI Verso" 
                className="mt-1 w-full h-auto border rounded"
              />
            </div>
          )}
        </div>

        {/* Représentant */}
        {buyer.representativeId && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">Représentant</h3>
            <div className="mt-2 space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nom</label>
                <p className="mt-1 text-sm text-gray-900">{buyer.representativeId.name}</p>
              </div>
            {/*   <div>
                <label className="block text-sm font-medium text-gray-500">Fonction</label>
                <p className="mt-1 text-sm text-gray-900">{buyer.representativeId.designation}</p>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDetails;