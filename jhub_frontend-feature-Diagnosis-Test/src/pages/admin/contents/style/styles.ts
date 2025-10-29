/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

export const styles = {
  header: css({ paddingTop: '30px', paddingLeft: '30px', marginBottom: '20px' }),
  pageWrapper: css({ display: 'flex', justifyContent: 'center', padding: '20px' }),
  detailCard: css({
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    width: '100%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }),
  contentBox: css({ marginTop: '10px', padding: '12px' }),
  loadingBox: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  }),
  Detaildata: css({
    display: 'flex',
    color: 'gray',
    borderTop: '1px solid #ddddddff',
    borderBottom: '1px solid #ddddddff',
    padding: '10px 0',
  }),
  count: css({ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingLeft: '60%' }),
  statusLabel: (flag: number) =>
    css({
      display: 'inline-block',
      textAlign: 'center',
      padding: '15px 40px',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#fff',
      backgroundColor: flag === 0 ? '#4CAF50' : '#F44336',
      alignSelf: 'flex-start',
      minWidth: '80px',
    }),
  statusButton: (flag: number) =>
    css({
      textAlign: 'center',
      margin: '8px 0',
      padding: '10px 50px',
      borderRadius: '30px',
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#fff',
      backgroundColor: flag === 0 ? '#F44336' : '#4CAF50',
    }),
  summary: css({ fontWeight: 'bold', borderBottom: '1px solid #ddddddff', paddingBottom: '10px' }),
  summarymain: css({ paddingTop: '10px' }),
  comment: css({ fontWeight: 'bold', paddingBottom: '10px', borderBottom: '1px solid #858585ff' }),
  commentTableContainer: css({
    maxHeight: '780px',
    width: '100%',
    overflowY: 'auto',
    marginTop: '10px',
    border: '1px solid #ddddddff',
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    '& .MuiTableCell-root': {
      fontSize: '16px',
      padding: '10px',
      verticalAlign: 'top',
    },
    '& .MuiTableBody-root .MuiTableCell-root': { padding: '20px 10px' },
    '& .MuiTableHead-root .MuiTableCell-root': { fontWeight: 'bold', backgroundColor: '#f5f5f5' },
  }),
  fullWidthTable: css({
    width: '100%', // 画面幅に広げる
    tableLayout: 'fixed', // レイアウトを固定（セル幅の自動調整を防ぐ）
  }),
  commentBodyCell: css({ whiteSpace: 'normal', wordBreak: 'break-word' }),
  noCommentCell: css({ height: '60px', fontSize: '16px', width: '1000px' }),
  commentBox: css({ paddingTop: 0 }),
  valueCell: css({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderTop: '1px solid #a7a5a5ff',
    '&:first-of-type': { borderTop: 'none' },
  }),
  valueCells: css({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    '&:first-of-type': { borderTop: 'none' },
  }),
  detailHeader: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  }),
  leftColumn: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  }),
  userBox: css({
    fontSize: '20px',
    margin: '8px 0px',
    display: 'flex',
    alignItems: 'center',
  }),
  thumbnailBox: css({
    marginLeft: 'auto',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '300px',
  }),
}

export const labelBoxStyle = {
  width: 160,
  backgroundColor: '#f0f0f0',
  padding: '15px',
  textAlign: 'center',
  borderBottomLeftRadius: 4,
  fontWeight: 'bold',
}
export const labelStyle = {
  width: 160,
  backgroundColor: '#f0f0f0',
  padding: '15px',
  textAlign: 'center',
  borderTopLeftRadius: 4,
  fontWeight: 'bold',
}
