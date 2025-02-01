/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react'
import Wrapper from '@/app/components/Wrapper'
// import { useUser } from '@clerk/nextjs'
const form = document.querySelector("#form");
const input = document.querySelector("#phone");
const output:any = document.querySelector("#output");

const re = /^\d{2}-\d{3}-\d{2}\d{2}$/;

export default function TachesPage() {
    // const { isLoaded, user } = useUser()
    
    interface TestInfoProps {
        phoneInput: HTMLInputElement | null;
    }

    const testInfo = ({ phoneInput }: TestInfoProps) => {
        const ok = re.exec(phoneInput?.value || '');
    
        output.textContent = ok
        ? `Thanks, your phone number is ${ok[0]}`
        : `${phoneInput?.value} isn't a phone number with area code!`;
    }
    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        testInfo({ phoneInput: input as HTMLInputElement });
    });
    
    return (
    <Wrapper>

        <p>Enter your phone number (with area code) and then click &quot;Check&quot;. <br />
        The expected format is like ###-###-####.</p>

    <form id='form' >
        <input type="text" id="phone" />
        <button type="submit">Check</button>
    </form>
    <p id="output">Entrer votre numéro de téléphone</p>
    </Wrapper>
  )
}
