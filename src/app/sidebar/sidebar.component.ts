import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

declare const $: any;

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/สารสนเทศ',
        title: 'บันทึกการใช้ไฟฟ้า',
        type: 'link',
        icontype: 'offline_bolt'
    },
    // {
    //     path: '/บันทึกการใช้ไฟฟ้า',
    //     title: 'บันทึกการใช้ไฟฟ้า',
    //     type: 'sub',
    //     icontype: 'offline_bolt',
    //     collapse: 'components',
    //     children: [
    //         { path: 'หอพัก', title: 'หอพักนักเรียน', ab: 'หอ' },
    //         { path: 'ร้านค้า', title: 'ร้านค้าในโรงเรียน', ab: 'ร้าน' },
    //     ]
    // },
    {
        path: '/รายงาน',
        title: 'เอกสาร-รายงาน',
        type: 'sub',
        icontype: 'print',
        collapse: 'document',
        children: [
            { path: 'รายงานสรุปค่าไฟฟ้า', title: 'รายงานสรุปค่าไฟฟ้า', ab: 'ส' },
            { path: 'ใบแจ้งจำระเงิน', title: 'ใบแจ้งจำระเงิน', ab: 'บ' },
        ]
    },
    {
        path: '/การตั้งค่า',
        title: 'การตั้งค่า',
        type: 'sub',
        icontype: 'build',
        collapse: 'setting',
        children: [
            { path: 'รอบบัญชี', title: 'รอบบัญชีเรียกเก็บ', ab: 'บ' },
            { path: 'ห้องพัก', title: 'ห้องพัก', ab: 'ห' },
            { path: 'ร้านค้า', title: 'ร้านค้า', ab: 'ร' },
            { path: 'ผู้ใช้ไฟฟ้า', title: 'ผู้ใช้ไฟฟ้า', ab: 'ผ' },
            { path: 'มิเตอร์', title: 'มิเตอร์', ab: 'ม' },
        ]
    },
    {
        path: '/การชำระเงิน',
        title: 'การชำระเงิน',
        type: 'sub',
        icontype: 'attach_money',
        collapse: 'account',
        children: [
            { path: 'สถานะการชำระเงิน', title: 'สถานะการชำระเงิน', ab: 'ST' },
            { path: 'อัปโหลดรายการชำระเงิน-KS', title: 'อัปโหลดรายการชำระเงิน-KS', ab: 'KS' },
            { path: 'อัปโหลดรายการชำระเงิน-CS', title: 'อัปโหลดรายการชำระเงิน-KS', ab: 'CS' },
        ]
    },
    {
        path: '/tables',
        title: 'คู่มือการใช้งาน',
        type: 'link',
        icontype: 'import_contacts'
    },
];


const RouteInfo_old = [{
    path: '/dashboard',
    title: 'หน้าหลัก',
    type: 'link',
    icontype: 'dashboard'
}, {
    path: '/components',
    title: 'Components',
    type: 'sub',
    icontype: 'dashboard',
    collapse: 'components',
    children: [
        { path: 'buttons', title: 'Buttons', ab: 'B' },
        { path: 'grid', title: 'Grid System', ab: 'GS' },
        { path: 'panels', title: 'Panels', ab: 'P' },
        { path: 'sweet-alert', title: 'Sweet Alert', ab: 'SA' },
        { path: 'notifications', title: 'Notifications', ab: 'N' },
        { path: 'icons', title: 'Icons', ab: 'I' },
        { path: 'typography', title: 'Typography', ab: 'T' }
    ]
}, {
    path: '/forms',
    title: 'Forms',
    type: 'sub',
    icontype: 'content_paste',
    collapse: 'forms',
    children: [
        { path: 'regular', title: 'Regular Forms', ab: 'RF' },
        { path: 'extended', title: 'Extended Forms', ab: 'EF' },
        { path: 'validation', title: 'Validation Forms', ab: 'VF' },
        { path: 'wizard', title: 'Wizard', ab: 'W' }
    ]
}, {
    path: '/tables',
    title: 'Tables',
    type: 'sub',
    icontype: 'grid_on',
    collapse: 'tables',
    children: [
        { path: 'regular', title: 'Regular Tables', ab: 'RT' },
        { path: 'extended', title: 'Extended Tables', ab: 'ET' },
        { path: 'datatables.net', title: 'Datatables.net', ab: 'DT' }
    ]
}, {
    path: '/maps',
    title: 'Maps',
    type: 'sub',
    icontype: 'place',
    collapse: 'maps',
    children: [
        { path: 'google', title: 'Google Maps', ab: 'GM' },
        { path: 'fullscreen', title: 'Full Screen Map', ab: 'FSM' },
        { path: 'vector', title: 'Vector Map', ab: 'VM' }
    ]
}, {
    path: '/widgets',
    title: 'Widgets',
    type: 'link',
    icontype: 'widgets'

}, {
    path: '/charts',
    title: 'Charts',
    type: 'link',
    icontype: 'timeline'

}, {
    path: '/calendar',
    title: 'Calendar',
    type: 'link',
    icontype: 'date_range'
}, {
    path: '/pages',
    title: 'Pages',
    type: 'sub',
    icontype: 'image',
    collapse: 'pages',
    children: [
        { path: 'pricing', title: 'Pricing', ab: 'P' },
        { path: 'timeline', title: 'Timeline Page', ab: 'TP' },
        { path: 'login', title: 'Login Page', ab: 'LP' },
        { path: 'register', title: 'Register Page', ab: 'RP' },
        { path: 'lock', title: 'Lock Screen Page', ab: 'LSP' },
        { path: 'user', title: 'User Page', ab: 'UP' }
    ]
}
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    userImage = '';
    user_full_name = '';

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.userImage = window.localStorage.getItem('user_image');
        this.user_full_name = window.localStorage.getItem('thai_name');
    }
    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            // let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}
