// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Demo Components
import ApiKeysList from './ApiKeysList'
import CreateApiKey from './CreateApikey'
import TwoFactorAuth from './TwoFactorAuth'
import RecentDevices from './RecentDevices'
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
import axios from 'axios';
import { getUserData } from '@utils'
import helper from '@src/@core/helper';
import { ClipLoader } from "react-spinners";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const defaultValues = {
  newPassword: '',
  currentPassword: '',
  retypeNewPassword: ''
}

const SecurityTabContent = () => {
  const SignupSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .min(5, obj => showErrors('Current Password', obj.value.length, obj.min))
      .required(),
    newPassword: yup
      .string()
      .min(8, obj => showErrors('New Password', obj.value.length, obj.min))
	  .matches(/^(?=.*?[a-z]).{1,}$/, 'Must contain at least one lowercase character')
      .required(),
    retypeNewPassword: yup
      .string()
      .min(8, obj => showErrors('Retype New Password', obj.value.length, obj.min))
      .required()
      .oneOf([yup.ref(`newPassword`), null], 'Passwords must match')
  })
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema)
  })

  const [overlay, setOverLay] = useState(false);

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      console.log('send change password api', data);
      let postData = {};
      postData.old_password = data.currentPassword;
      postData.new_password = data.newPassword;

      console.log('send change password api', postData);
      setOverLay(true);
      axios.post(`${jwtDefaultConfig.clientBaseUrl}/change-password/${getUserData().customer_id}`, postData)
      .then(res => {
        helper.redirectToCustomerLogin( helper.isObject(res.data) ? res.data.code : 201);
        if (res.status == 200) {
          if (res.data.code == 200) {
            helper.toastNotification(res.data.message, 'SUCCESS_MESSAGE');
          } else {
            helper.toastNotification(res.data.message, 'FAILED_MESSAGE');
          }
        }
        setOverLay(false);
      })
      .catch(async (error) => {
        console.log(error, 'error')
        setOverLay(false);
        helper.toastNotification('Unable to get data.', "FAILED_MESSAGE");
      });
      //return null
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  return (
    <Fragment>
      <ClipLoader
          css={`
          position: fixed;
          top: 40%;
          left: 40%;
          right: 40%;
          bottom: 20%;
          z-index: 999999;
          display: block;
      `}
          size={"200px"}
          this
          also
          works
          color={"#196633"}
          height={100}
          loading={overlay ? true : false}
      />
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Change Password</CardTitle>
        </CardHeader>
        <CardBody className='pt-1'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm='6' className='mb-1'>
                <Controller
                  control={control}
                  id='currentPassword'
                  name='currentPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='Current Password'
                      htmlFor='currentPassword'
                      className='input-group-merge'
                      invalid={errors.currentPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.currentPassword && (
                  <FormFeedback className='d-block'>{errors.currentPassword.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              <Col sm='6' className='mb-1'>
                <Controller
                  control={control}
                  id='newPassword'
                  name='newPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='New Password'
                      htmlFor='newPassword'
                      className='input-group-merge'
                      invalid={errors.newPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.newPassword && <FormFeedback className='d-block'>{errors.newPassword.message}</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Controller
                  control={control}
                  id='retypeNewPassword'
                  name='retypeNewPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='Retype New Password'
                      htmlFor='retypeNewPassword'
                      className='input-group-merge'
                      invalid={errors.newPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.retypeNewPassword && (
                  <FormFeedback className='d-block'>{errors.retypeNewPassword.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12}>
                <p className='fw-bolder'>Password requirements:</p>
                <ul className='ps-1 ms-25'>
                  <li className='mb-50'>Minimum 8 characters long - the more, the better</li>
                  <li className='mb-50'>At least one lowercase character</li>
                  {/* <li>At least one number, symbol, or whitespace character</li> */}
                </ul>
              </Col>
              <Col className='mt-1' sm='12'>
                <Button type='submit' className='me-1' color='primary'>
                  Save changes
                </Button>
                <Button color='secondary' outline>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {/* <TwoFactorAuth />
      <CreateApiKey />
      <ApiKeysList />
      <RecentDevices /> */}
    </Fragment>
  )
}

export default SecurityTabContent
