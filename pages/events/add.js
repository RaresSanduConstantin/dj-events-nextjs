import Layout from '../../components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseCookies } from '@/helpers/index';

export default function AddEventPage({token}) {
  const [values, setValues] = useState({
    name: '',
    performers: '',
    venue: '',
    address: '',
    date: '',
    time: '',
    description: '',
  });

  const [image, setImage] = useState(null);
  const [wasEventUploaded, setwasEventUploaded] = useState(null);



  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    );

    if (hasEmptyFields) {
      toast.error('Please fill in all fields', {
        autoClose: 2000,
        pauseOnHover: false,
      });
    } else {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          toast.error('No token included')
          return
        }
        toast.error('Something Went Wrong')
      } else {
        const evt = await res.json();
        console.log(evt);
        setwasEventUploaded(evt);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({ ...values, [name]: value });
  };

  const hadnleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    console.log('submit');
    const formData = new FormData();

    formData.append('files', image);

    formData.append('ref', 'events');
    formData.append('refId', wasEventUploaded.id);
    formData.append('field', 'image');

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
      
    });
    
    if (!res.ok) {
      toast.error('Something went wrong!');
    } else {
      const imgEvt = await res.json();
      console.log(imgEvt);
      router.push(`/events/${wasEventUploaded.slug}`);
    }
  };

  return (
    <Layout title='Add new event'>
      <Link href='/events'>Go back</Link>
      <h1>Add Event</h1>
      <ToastContainer />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <lable htmlFor='name'>Event Name</lable>
            <input
              type='text'
              id='name'
              name='name'
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='performers'>Performers</label>
            <input
              type='text'
              name='performers'
              id='performers'
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              id='venue'
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              name='address'
              id='address'
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              name='date'
              id='date'
              value={values.date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='time'>Time</label>
            <input
              type='text'
              name='time'
              id='time'
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor='description'>Event Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type='submit' className='btn' value='Add Event' />
      </form>

      <form onSubmit={handleImageSubmit} className={styles.form}>
        <div>
          <lable htmlFor='name'>Upload Image</lable>
          <div className={styles.file}>
            <input type='file' name='image' onChange={hadnleFileChange} />
          </div>
          <input
            disabled={!wasEventUploaded}
            type='submit'
            value='Add Image'
            className={!wasEventUploaded ? 'btn-disable' : 'btn'}
          />
        </div>
      </form>
    </Layout>
  );
}

export async function getServerSideProps({req}) {
  const {token} = parseCookies(req)

  return {
    props: {
      token
    }
  }
  
}