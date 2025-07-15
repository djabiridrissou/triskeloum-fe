import React, { useState } from 'react';
import { Tabs, Badge, Button, Space, Table, Tag, message } from 'antd';
import Swal from 'sweetalert2';
import { useGetEvaluatedBatchesQuery, useMakeEvaluationMutation } from '../../services/api';

const AdminHomologation = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [updateBatch] = useMakeEvaluationMutation();

    const pendingParams = {
        isEvaluated: 'false',
        sortField: 'createdAt',
        sortOrder: 'desc'
    };

    const evaluatedParams = {
        isEvaluated: 'true',
        sortField: 'evaluatedAt',
        sortOrder: 'desc'
    };

    const {
        data: pendingData,
        isLoading: pendingLoading,
        refetch: refetchPending
    } = useGetEvaluatedBatchesQuery(pendingParams);

    const {
        data: evaluatedData,
        isLoading: evaluatedLoading,
        refetch: refetchEvaluated
    } = useGetEvaluatedBatchesQuery(evaluatedParams);

    const handleApplyPrice = async (batchId: string) => {
        const { value: price } = await Swal.fire({
            title: 'Appliquer le PRIX',
            input: 'number',
            inputLabel: 'Prix de vente',
            inputPlaceholder: 'Entrez le prix',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Vous devez entrer un prix!';
                }
                if (isNaN(Number(value)) || Number(value) <= 0) {
                    return 'Le prix doit être un nombre positif';
                }
                return null;
            }
        });

        if (price) {
            try {
                await updateBatch({
                    batchId,
                    amountPerUnit: Number(price),
                }).unwrap();

                message.success('Prix appliqué avec succès');
                refetchPending();
                refetchEvaluated();
            } catch (err) {
                message.error('Erreur lors de la mise à jour du prix');
            }
        }
    };

    const columns = [
        {
            title: 'N° Lot',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Produit',
            dataIndex: 'productId',
            key: 'product',
            render: (product: any) => (
                <div>
                    <div>{product?.name}</div>
                    <div className="text-xs text-gray-500">{product?.code}</div>
                </div>
            ),
        },
        {
            title: 'Fournisseur',
            key: 'socialReason',
            render: (_: any, record: any) => (
                <span>{record.supplierInfo?.socialReason || '—'}</span>
            ),
        },
        {
            title: 'Quantité',
            dataIndex: 'actualQty',
            key: 'actualQty',
        },
        {
            title: 'Prix Unitaire',
            dataIndex: 'unitPrice',
            key: 'unitprice',
        },
        {
            title: 'Prix Homologué',
            dataIndex: 'amountPerUnit',
            key: 'evaluatedAmount',
            render: (amount: number, record: any) => (
                <span>{record.evaluation?.amountPerUnit || '—'}</span>
            ),
        },
        {
            title: 'Date création',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    {!record.isEvaluated && (
                        <Button
                            type="primary"
                            onClick={() => handleApplyPrice(record._id)}
                        >
                            Appliquer PRIX
                        </Button>
                    )}
                    {record.isEvaluated && (
                        <>
                            <span>Homologué le {new Date(record.updatedAt).toLocaleDateString()}</span>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    // Style pour les lignes homologuées
    const rowClassName = (record: any) => {
        return record.isEvaluated ? '' : '';
    };

    const items = [
        {
            key: 'pending',
            label: (
                <Badge count={pendingData?.pagination?.total} offset={[10, -5]}>
                    <span>En Attente</span>
                </Badge>
            ),
            children: (
                <Table
                    columns={columns}
                    dataSource={pendingData?.data}
                    loading={pendingLoading}
                    rowKey="_id"
                    rowClassName={rowClassName}
                    pagination={{
                        pageSize: pendingData?.pagination?.limit,
                        total: pendingData?.pagination?.total,
                        current: pendingData?.pagination?.page,
                    }}
                />
            ),
        },
        {
            key: 'evaluated',
            label: (
                <Badge count={evaluatedData?.pagination?.total} offset={[10, -5]}>
                    <span>Homologués</span>
                </Badge>
            ),
            children: (
                <Table
                    columns={columns}
                    dataSource={evaluatedData?.data}
                    loading={evaluatedLoading}
                    rowKey="_id"
                    rowClassName={rowClassName}
                    pagination={{
                        pageSize: evaluatedData?.pagination?.limit,
                        total: evaluatedData?.pagination?.total,
                        current: evaluatedData?.pagination?.page,
                    }}
                />
            ),
        },
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h1 className="text-xl font-semibold mb-4">Homologation des Lots</h1>
            <Tabs
                activeKey={activeTab}
                items={items}
                onChange={setActiveTab}
                tabBarStyle={{ marginBottom: 24 }}
            />
        </div>
    );
};

export default AdminHomologation;