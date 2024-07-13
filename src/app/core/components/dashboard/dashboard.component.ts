import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from '../layout/services/app.layout.service';
import { DashboardService } from '../../../services/dashboard.service';
import { DashboardDto } from '../../../interfaces/models/dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  items!: MenuItem[];

  chartData: any;
  chartOptions: any;
  subscription!: Subscription;

  // Define variables to hold API data
  ordersCount = 0;
  newOrdersCount = 0;
  revenue = 0;
  revenueIncreasePercentage = 0;
  customersCount = 0;
  newCustomersCount = 0;
  roomsCount = 0;
  availableRoomsCount = 0;
  recentBookings: any[] = [];
  bestBookingRooms: any[] = [];
  todayNotifications: any[] = [];
  yesterdayNotifications: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    public layoutService: LayoutService
  ) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe(() => {
        this.initChart();
      });
  }

  ngOnInit(): void {
    this.initChart();
    this.fetchDashboardData();

    this.items = [
      { label: 'Add New', icon: 'pi pi-fw pi-plus' },
      { label: 'Remove', icon: 'pi pi-fw pi-minus' },
    ];
  }

  initChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'Revenue',
          data: [], // This will be populated with API data
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: (value: any): string => {
              return '$' + value;
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      },
    };
  }

  fetchDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe((data: DashboardDto) => {
      this.ordersCount = data.ordersCount;
      this.newOrdersCount = data.newOrdersCount;
      this.revenue = data.revenue;
      this.revenueIncreasePercentage = data.revenueIncreasePercentage;
      this.customersCount = data.customersCount;
      this.newCustomersCount = data.newCustomersCount;
      this.roomsCount = data.roomsCount;
      this.availableRoomsCount = data.availableRoomsCount;
      this.recentBookings = data.recentBookings;
      this.bestBookingRooms = data.bestBookingRooms;
      this.todayNotifications = data.todayNotifications;
      this.yesterdayNotifications = data.yesterdayNotifications;

      // Populate chart data
      this.chartData.datasets[0].data = data.monthlyRevenue;

      // Update the chart options to force a re-render if needed
      this.chartOptions = {
        ...this.chartOptions,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue('--text-color'),
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue('--text-color-secondary'),
            },
            grid: {
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue('--surface-border'),
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue('--text-color-secondary'),
              callback: (value: any): string => {
                return '$' + value;
              },
            },
            grid: {
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue('--surface-border'),
              drawBorder: false,
            },
          },
        },
      };
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
