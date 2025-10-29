/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Alert, Button, IconButton, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useLoginMutation } from '../../api/hook/login'
import text from '../../utils/text.json'
import { JSS_LOGIN_URL } from '../../utils/URL'
import type { LoginSchemaType } from '../../validation/LoginSchema'
import { loginSchema } from '../../validation/LoginSchema'
import ContentsWrapper from '../common/contentsWrapper'

const Login = () => {
  const [errorFlg, setErrorFlg] = useState(false)
  const { mutate, isPending } = useLoginMutation(setErrorFlg)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    defaultValues: { id: '', pass: '' },
    resolver: zodResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<LoginSchemaType> = data => {
    const loginData = {
      emp_id: data.id,
      emp_passwd: data.pass,
    }

    mutate(loginData)
  }
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  console.log(window.location.href)

  return (
    <ContentsWrapper>
      <div css={bgWrap}>
        <form css={formStyle} onSubmit={handleSubmit(onSubmit)}>
          <div css={formInner}>
            <div css={loginTitle}>{text.login['login.title']}</div>
            {errorFlg && (
              <div css={errStyle}>
                <Alert severity="error">{text.error.unauthorized}</Alert>
              </div>
            )}
            <div css={errStyle}>
              {/* バリデーションエラー */}
              {errors.id && <Alert severity="error">{errors.id.message}</Alert>}
            </div>
            <div css={columnStyle}>
              <div css={inputColumn}>
                <TextField id="id" {...register('id')} placeholder={text.login['input.id']} />
              </div>
            </div>
            <div css={errStyle}>
              {/* バリデーションエラー */}
              {errors.pass && <Alert severity="error">{errors.pass.message}</Alert>}{' '}
            </div>
            <div css={columnStyle}>
              <div css={inputColumn}>
                <TextField
                  id="pass"
                  type={showPassword ? 'text' : 'password'}
                  {...register('pass')}
                  placeholder={text.login['input.pass']}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>
            </div>
            <div css={linkColum}>
              <a href={JSS_LOGIN_URL} target="_blank" rel="noopener noreferrer">
                {text.login['link.label']}
              </a>
            </div>
            <Button css={loginButton} type="submit" disabled={isPending}>
              {text.login['submit.button']}
            </Button>
          </div>
        </form>
      </div>
    </ContentsWrapper>
  )
}

export default Login

// ===== styles =====
const bgWrap = css({
  minHeight: '100vh',
  background: '#ffc862',
  padding: '0 0 40px 0',
  width: '100%',
})

const formStyle = css({
  paddingTop: '70px',
  width: '50%',
  margin: 'auto',
  textAlign: 'center',
})

const loginTitle = css({
  fontSize: '30px',
  paddingTop: '30px',
  paddingBottom: '20px',
  fontWeight: 'bold',
})

const formInner = css({
  border: 'none',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
})

const errStyle = css({
  marginLeft: '125px',
})

const columnStyle = css({
  padding: '5px',
  display: 'flex',
  ' input': {
    display: 'block',
  },
})

const inputColumn = css({
  padding: '5px 40px 20px 40px',
  width: '100%',
  '& .MuiTextField-root': {
    textAlign: 'center',
    width: '80%',
    '& .MuiOutlinedInput-root': {
      border: '1px solid',
      borderRadius: '40px',
    },
  },
})

const linkColum = css({
  padding: '10px',
})

const loginButton = css({
  fontSize: '20px',
  fontWeight: 'bold',
  borderRadius: '40px',
  width: '140px',
  height: '40px',
  marginTop: '20px',
  marginBottom: '40px',
  padding: '10px',
  backgroundColor: 'green',
  color: 'white',
})
