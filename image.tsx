import React from 'react'

export function Image(avatar: string, username: string) {
    return <div
        style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            fontSize: 160,
            fontWeight: 400,
        }}
    >
        <img src={avatar} alt="avatar" style={{ margin: '0 75px', width: 550, height: 550, borderRadius: '50%' }} />
        <div style={{ marginTop: 128 }}>{ username }</div>
    </div>
}
