import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/NewShippingLabel.css';

interface AddressForm {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
}

interface ParcelForm {
    weight: string;
    length: string;
    width: string;
    height: string;
}

const initialAddress: AddressForm = {
    name: '',
    street1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
};

const initialParcel: ParcelForm = {
    weight: '',
    length: '',
    width: '',
    height: '',
};

export default function NewShippingLabel() {
    const navigate = useNavigate();

    const [fromAddress, setFromAddress] =
        useState<AddressForm>(initialAddress);

    const [toAddress, setToAddress] =
        useState<AddressForm>(initialAddress);

    const [parcel, setParcel] =
        useState<ParcelForm>(initialParcel);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddressChange = (
        type: 'from' | 'to',
        field: keyof AddressForm,
        value: string
    ) => {
        const setter =
            type === 'from'
                ? setFromAddress
                : setToAddress;

        setter((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleParcelChange = (
        field: keyof ParcelForm,
        value: string
    ) => {
        setParcel((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await api.post(
                '/shipping-labels',
                {
                    from_address: {
                        ...fromAddress,
                        country: 'US',
                    },
                    to_address: {
                        ...toAddress,
                        country: 'US',
                    },
                    parcel: {
                        weight: Number(parcel.weight),
                        length: Number(parcel.length),
                        width: Number(parcel.width),
                        height: Number(parcel.height),
                    },
                }
            );

            const label = response.data;

            window.open(
                label.label_pdf_url || label.label_url,
                '_blank'
            );

            navigate('/shipping-labels');
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                'Unable to create shipping label.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-label-page">
            <header className="new-label-header">
                <button
                    className="back-button"
                    type="button"
                    onClick={() =>
                        navigate('/shipping-labels')
                    }
                >
                    ← Back
                </button>

                <h1>New Shipping Label</h1>
            </header>

            <main className="new-label-content">
                <form
                    className="label-form"
                    onSubmit={handleSubmit}
                >
                    <section className="form-card">
                        <div className="section-header">
                            <h2>From Address</h2>
                            <span>Sender</span>
                        </div>

                        <AddressFields
                            address={fromAddress}
                            onChange={(field, value) =>
                                handleAddressChange(
                                    'from',
                                    field,
                                    value
                                )
                            }
                        />
                    </section>

                    <section className="form-card">
                        <div className="section-header">
                            <h2>To Address</h2>
                            <span>Recipient</span>
                        </div>

                        <AddressFields
                            address={toAddress}
                            onChange={(field, value) =>
                                handleAddressChange(
                                    'to',
                                    field,
                                    value
                                )
                            }
                        />
                    </section>

                    <section className="form-card">
                        <div className="section-header">
                            <h2>Package</h2>
                            <span>USPS package details</span>
                        </div>

                        <div className="form-grid four-columns">
                            <div className="form-field">
                                <label htmlFor="weight">
                                    Weight (oz)
                                </label>

                                <input
                                    id="weight"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={parcel.weight}
                                    onChange={(event) =>
                                        handleParcelChange(
                                            'weight',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="length">
                                    Length (in)
                                </label>

                                <input
                                    id="length"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={parcel.length}
                                    onChange={(event) =>
                                        handleParcelChange(
                                            'length',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="width">
                                    Width (in)
                                </label>

                                <input
                                    id="width"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={parcel.width}
                                    onChange={(event) =>
                                        handleParcelChange(
                                            'width',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="height">
                                    Height (in)
                                </label>

                                <input
                                    id="height"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={parcel.height}
                                    onChange={(event) =>
                                        handleParcelChange(
                                            'height',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate('/shipping-labels')
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="generate-button"
                            disabled={loading}
                        >
                            {loading
                                ? 'Generating...'
                                : 'Generate Label'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

interface AddressFieldsProps {
    address: AddressForm;
    onChange: (
        field: keyof AddressForm,
        value: string
    ) => void;
}

function AddressFields({
    address,
    onChange,
}: AddressFieldsProps) {
    return (
        <div className="form-grid">
            <div className="form-field full-width">
                <label>Name</label>
                <input
                    required
                    value={address.name}
                    onChange={(event) =>
                        onChange('name', event.target.value)
                    }
                />
            </div>

            <div className="form-field">
                <label>Street</label>
                <input
                    type='text'
                    required
                    value={address.street1}
                    onChange={(event) =>
                        onChange(
                            'street1',
                            event.target.value
                        )
                    }
                />
            </div>

            <div className="form-field">
                <label>City</label>
                <input
                    type='text'
                    required
                    value={address.city}
                    onChange={(event) =>
                        onChange('city', event.target.value)
                    }
                />
            </div>

            <div className="form-field">
                <label>State</label>
                <input
                    type="text"
                    required
                    maxLength={2}
                    value={address.state}
                    onChange={(event) =>
                        onChange(
                            'state',
                            event.target.value
                                .replace(/[^a-zA-Z]/g, '')
                                .toUpperCase()
                        )
                    }
                />
            </div>

            <div className="form-field">
                <label htmlFor="country">
                    Country
                </label>

                <select
                    id="country"
                    value="US"
                    disabled
                >
                    <option value="US">
                        United States (US)
                    </option>
                </select>
            </div>

            <div className="form-field">
                <label>ZIP Code</label>
                <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    value={address.zip}
                    onChange={(event) =>
                        onChange(
                            'zip',
                            event.target.value.replace(/[^\d-]/g, '')
                        )
                    }
                    pattern="\d{5}(-\d{4})?"
                    placeholder="12345"
                />
            </div>

            <div className="form-field">
                <label>Phone</label>
                <input
                    type="tel"
                    value={address.phone}
                    onChange={(event) =>
                        onChange('phone', event.target.value)
                    }
                    placeholder="(555) 123-4567"
                />
            </div>

            <div className="form-field">
                <label>Email</label>
                <input
                    type="email"
                    value={address.email}
                    onChange={(event) =>
                        onChange('email', event.target.value)
                    }
                />
            </div>
        </div>
    );
}